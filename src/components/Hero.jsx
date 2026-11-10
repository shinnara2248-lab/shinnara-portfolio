import { useRef } from 'react';
import { Download } from 'lucide-react';
import { media } from '../data/site';
import { Action } from './UI';
import { HeroRippleCanvas } from './HeroRippleCanvas';

function RippleField({ id, scale }) {
  return <filter id={id} x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".0035 .018" numOctaves="2" seed="12"
      x="-18%" y="-22%" width="136%" height="144%" result="waveField" />
    <feOffset in="waveField" dx="-48" dy="0" x="-10%" y="-14%" width="120%" height="128%" result="movingWaveField">
      {/* Offset the two axes by a quarter cycle so the ripples flow through every turn. */}
      <animate attributeName="dx" values="-48;0;48;0;-48" dur="17s" repeatCount="indefinite"
        calcMode="spline" keyTimes="0;.25;.5;.75;1"
        keySplines=".4 0 .7 .6;.3 .4 .6 1;.4 0 .7 .6;.3 .4 .6 1" />
      <animate attributeName="dy" values="0;19;0;-19;0" dur="17s" repeatCount="indefinite"
        calcMode="spline" keyTimes="0;.25;.5;.75;1"
        keySplines=".3 .4 .6 1;.4 0 .7 .6;.3 .4 .6 1;.4 0 .7 .6" />
    </feOffset>
    <feDisplacementMap in="SourceGraphic" in2="movingWaveField" scale={scale}
      xChannelSelector="R" yChannelSelector="G" />
  </filter>;
}

function OceanRippleFilters() {
  return <svg className="hero-wave-definitions" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      <RippleField id="hero-ocean-ripple" scale={16} />
    </defs>
  </svg>;
}

export function Hero({ onResume }) {
  const water = useRef(null);

  return <section id="home" className="hero sea-section" aria-labelledby="home-title">
    <OceanRippleFilters />
    <div className="hero-parallax"><div className="hero-art">
      <picture aria-hidden="true">
        <source media="(min-width: 741px)" srcSet={media.waves} />
        <img className="hero-wave-image" src={media.heroWaves} ref={water} alt="" fetchPriority="high" />
      </picture>
      <HeroRippleCanvas imageRef={water} />
    </div></div>
    <div className="shell hero-inner">
      <div className="hero-copy">
        <p className="eyebrow hero-enter">WEB PUBLISHER PORTFOLIO</p>
        <h1 id="home-title" className="hero-enter">SHIN NARA</h1>
        <p className="hero-tagline hero-enter">Explore. Design. Build.</p>
        <p className="hero-intro hero-enter">사용자 경험을 탐색하고,<br />디자인으로 경험을 설계하며,<br />코드로 가치를 완성하는 웹퍼블리셔 신나라입니다.</p>
        <div className="hero-actions hero-enter">
          <Action href="#projects" className="action--filled">프로젝트 보러가기</Action>
          <Action icon={Download} onClick={onResume}>이력서 미리보기</Action>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#about" className="scroll-cue"><span className="mouse" aria-hidden="true" />Scroll<span className="scroll-line" /></a>
        <p className="eyebrow hero-edition">OCEANIC EXPLORER <span> / </span> VOL. 01</p>
      </div>
    </div>
  </section>;
}
