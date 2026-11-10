import { useEffect, useRef } from 'react';

const RIPPLE_COUNT = 12;
const LIFETIME = 1.85;
const SPREAD_SPEED = 72;
const EMISSION_INTERVAL = 52;
const EMISSION_SPACING = 34;

const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * vec2(0.5, -0.5) + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentSource = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_water;
uniform vec2 u_size;
uniform vec2 u_crop;
uniform vec2 u_anchor;
uniform vec4 u_impacts[${RIPPLE_COUNT}];

void main() {
  vec2 pixel = v_uv * u_size;
  vec2 displacement = vec2(0.0);
  float coverage = 0.0;

  for (int i = 0; i < ${RIPPLE_COUNT}; i++) {
    vec4 impact = u_impacts[i];
    if (impact.w <= 0.0) continue;
    vec2 delta = pixel - impact.xy;
    vec2 ellipse = delta * vec2(0.88, 1.12);
    float distanceToImpact = length(ellipse);
    float angle = atan(ellipse.y, ellipse.x + 0.001);
    float radius = 9.0 + impact.z * ${SPREAD_SPEED.toFixed(1)};
    float edge = distanceToImpact - radius + sin(angle * 3.0 + impact.z * 4.0) * 6.0;
    float fade = pow(max(0.0, 1.0 - impact.z / ${LIFETIME.toFixed(2)}), 1.55) * impact.w;
    float envelope = exp(-abs(edge) / (25.0 + impact.z * 13.0)) * fade;
    float wave = cos(edge * 0.105 - impact.z * 2.0);
    vec2 direction = delta / max(length(delta), 8.0);

    displacement += direction * wave * envelope * 34.0;
    coverage += envelope * (0.45 + 0.55 * abs(wave));
  }

  vec2 warp = clamp(displacement, vec2(-37.0), vec2(37.0)) / u_size;
  vec2 uv = (v_uv + warp - u_anchor) * u_crop + u_anchor;
  vec2 fringe = warp * u_crop * 0.11;
  vec3 refracted = vec3(
    texture2D(u_water, uv + fringe).r,
    texture2D(u_water, uv).g,
    texture2D(u_water, uv - fringe).b
  );
  gl_FragColor = vec4(refracted, min(coverage * 1.3, 0.91));
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function createRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(program, 'u_water'), 0);

  const size = gl.getUniformLocation(program, 'u_size');
  const crop = gl.getUniformLocation(program, 'u_crop');
  const anchor = gl.getUniformLocation(program, 'u_anchor');
  const impacts = gl.getUniformLocation(program, 'u_impacts[0]');
  let source;
  let lastWidth = 0;
  let lastHeight = 0;

  return {
    draw(image, width, height, points) {
      if (gl.isContextLost()) return;
      const sourceChanged = source !== image.currentSrc;
      if (sourceChanged) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        source = image.currentSrc;
      }
      if (sourceChanged || lastWidth !== width || lastHeight !== height) {
        const resolution = Math.min(window.devicePixelRatio || 1, 1.25, 1600 / Math.max(width, height));
        canvas.width = Math.max(1, Math.round(width * resolution));
        canvas.height = Math.max(1, Math.round(height * resolution));
        gl.viewport(0, 0, canvas.width, canvas.height);
        const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const align = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100);
        gl.uniform2f(size, width, height);
        gl.uniform2f(crop, width / (image.naturalWidth * cover), height / (image.naturalHeight * cover));
        gl.uniform2f(anchor, align[0] || 0, align[1] || 0);
        lastWidth = width;
        lastHeight = height;
      }
      gl.uniform4fv(impacts, points);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

function createCanvasRenderer(canvas) {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return null;

  let lastWidth = 0;
  let lastHeight = 0;
  let source;
  let cover;

  return {
    draw(image, width, height, points) {
      if (lastWidth !== width || lastHeight !== height || source !== image.currentSrc) {
        const resolution = Math.min(window.devicePixelRatio || 1, 1, 1100 / Math.max(width, height));
        canvas.width = Math.max(1, Math.round(width * resolution));
        canvas.height = Math.max(1, Math.round(height * resolution));
        context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        const [x, y] = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100);
        cover = [(width - imageWidth) * x, (height - imageHeight) * y, imageWidth, imageHeight];
        lastWidth = width;
        lastHeight = height;
        source = image.currentSrc;
      }

      context.clearRect(0, 0, width, height);
      for (let i = 0; i < points.length; i += 4) {
        const strength = points[i + 3];
        if (!strength) continue;
        const x = points[i];
        const y = points[i + 1];
        const age = points[i + 2];
        const radius = 11 + age * SPREAD_SPEED;
        const fade = Math.pow(Math.max(0, 1 - age / LIFETIME), 1.55) * strength;

        for (const direction of [1, -1]) {
          const outer = Math.max(4, radius + direction * 16);
          const inner = Math.max(1, outer - 12 - age * 5);
          context.save();
          context.beginPath();
          context.ellipse(x, y, outer * 1.13, outer * .89, -.1, 0, Math.PI * 2);
          context.ellipse(x, y, inner * 1.13, inner * .89, -.1, 0, Math.PI * 2);
          context.clip('evenodd');
          context.globalAlpha = fade * .82;
          context.drawImage(image, cover[0] + direction * fade * 19, cover[1] - direction * fade * 12, cover[2], cover[3]);
          context.restore();
        }

      }
    },
    dispose() {},
  };
}

export function HeroRippleCanvas({ imageRef }) {
  const webglRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    const hero = webglRef.current.closest('section');
    let canvas = webglRef.current;
    const motion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const ripples = [];
    const points = new Float32Array(RIPPLE_COUNT * 4);
    let renderer;
    let frame = 0;
    let lastPoint;

    function draw(now) {
      frame = 0;
      while (ripples.length && now - ripples[0].start >= LIFETIME * 1000) ripples.shift();
      if (!ripples.length || !motion.matches || !image.complete || !image.naturalWidth) {
        delete canvas.dataset.active;
        ripples.length = 0;
        lastPoint = undefined;
        return;
      }

      points.fill(0);
      ripples.forEach(({ x, y, start, strength }, index) => {
        points.set([x, y, (now - start) / 1000, strength], index * 4);
      });
      renderer.draw(image, canvas.clientWidth, canvas.clientHeight, points);
      frame = requestAnimationFrame(draw);
    }

    function emit(event) {
      if (event.pointerType !== 'mouse' || !motion.matches || !image.complete || !image.naturalWidth) return;
      if (renderer === undefined) {
        renderer = createRenderer(canvas);
        if (!renderer) {
          canvas = fallbackRef.current;
          renderer = createCanvasRenderer(canvas);
        }
      }
      if (!renderer) return;
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const now = performance.now();
      const distance = lastPoint ? Math.hypot(x - lastPoint.x, y - lastPoint.y) : 0;
      if (lastPoint && (now - lastPoint.start < EMISSION_INTERVAL || distance < EMISSION_SPACING)) return;
      const strength = lastPoint ? Math.min(1, 0.56 + distance / 100) : 0.72;
      lastPoint = { x, y, start: now, strength };
      if (ripples.length === RIPPLE_COUNT) ripples.shift();
      ripples.push(lastPoint);
      canvas.dataset.active = '';
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function resetPointer() {
      lastPoint = undefined;
    }

    hero.addEventListener('pointerenter', emit);
    hero.addEventListener('pointermove', emit);
    hero.addEventListener('pointerleave', resetPointer);
    return () => {
      hero.removeEventListener('pointerenter', emit);
      hero.removeEventListener('pointermove', emit);
      hero.removeEventListener('pointerleave', resetPointer);
      cancelAnimationFrame(frame);
      delete canvas.dataset.active;
      renderer?.dispose?.();
    };
  }, [imageRef]);

  return <>
    <canvas className="hero-ripple-canvas" ref={webglRef} aria-hidden="true" />
    <canvas className="hero-ripple-canvas" ref={fallbackRef} aria-hidden="true" />
  </>;
}
