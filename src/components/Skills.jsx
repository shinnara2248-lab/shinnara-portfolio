import { useRef, useState } from 'react';
import { useAnimationFrame, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { media } from '../data/site';
import { skills } from '../data/skillsData';
import { projects } from '../data/projectsData';
import { Modal, SectionTitle } from './UI';

const startAngle = 168;
const toRadian = Math.PI / 180;
function position(index, offset = 0) {
  const angle = (startAngle + index * 360 / skills.length + offset) * toRadian;
  const x = Math.cos(angle);
  const depth = Math.sin(angle);
  return {
    left: `${50 + 43 * x}%`,
    top: `${50 + 35 * depth}%`,
    '--tile-scale': (0.96 + 0.09 * depth - 0.11 * Math.abs(x) ** 3).toFixed(3),
    '--tile-tilt': `${(-10 * x).toFixed(2)}deg`,
  };
}

function SkillIcon({ icon, index }) {
  return <span className="skill-crystal" aria-hidden="true" style={{ '--glint-delay': `${index * -0.81}s` }}>
    <img className="skill-glass-render" src={icon} width="160" height="160" alt="" loading="lazy" draggable="false" />
    <i className="skill-icon-spark" />
  </span>;
}

export function Skills({ onSkill, modalOpen }) {
  const nodes = useRef([]);
  const moon = useRef(null);
  const stage = useRef(null);
  const offset = useRef(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  useAnimationFrame((_, delta) => {
    const orbit = stage.current;
    if (!orbit || !orbit.matches('.is-visible') || paused || modalOpen || reduce ||
      orbit.querySelector('.skill-node:focus-visible') || matchMedia('(max-width: 900px), (pointer: coarse)').matches) return;
    offset.current = (offset.current + Math.min(delta, 40) * .0023) % 360;
    nodes.current.forEach((node, index) => {
      if (!node) return;
      Object.entries(position(index, offset.current)).forEach(([property, value]) => {
        node.style.setProperty(property, value);
      });
    });
  });
  function track(event) {
    if (reduce || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    moon.current.style.setProperty('--orb-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 17}px`);
    moon.current.style.setProperty('--orb-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 12}px`);
  }
  return <section id="skills" className="skills sea-section sea-parallax" aria-labelledby="skills-title" style={{ '--sea': `url(${media.heroWaves})` }}>
    <div className="shell skills-grid">
      <div className="skills-intro">
        <SectionTitle label="02. SKILLS" title="My Tools" id="skills-title">
          프로젝트에 맞는 도구를 고르고, 디자인을 코드로 구현합니다.
        </SectionTitle>
        <button type="button" className="orbit-control" onClick={() => setPaused(!paused)}>
          {paused ? <Play size={13} /> : <Pause size={13} />}{paused ? '궤도 움직임 재생' : '궤도 움직임 정지'}
        </button>
      </div>
      <div className="orbit-stage" ref={stage} data-orbit onPointerMove={track} onPointerLeave={() => {
        moon.current.style.removeProperty('--orb-x');
        moon.current.style.removeProperty('--orb-y');
      }}>
        <div className="orbit-line orbit-line--outer" aria-hidden="true" />
        <div className="orbit-line orbit-line--inner" aria-hidden="true" />
        <div className="skill-moon" ref={moon} aria-hidden="true">
          <img className="skill-moon-surface" src={media.moon} width="640" height="640" alt="" loading="lazy" />
          <i className="skill-glint skill-glint--top" />
          <i className="skill-glint skill-glint--lower" />
        </div>
        <div className="orbit-nodes">
          {skills.map(({ name, category, icon }, index) => <button key={name} type="button"
            ref={(node) => { nodes.current[index] = node; }} style={position(index)} className="skill-node"
            aria-label={`${name} 기술 설명`} onClick={() => onSkill(skills[index])}>
            <SkillIcon icon={icon} index={index} />
            <span>{name}</span><small>{category}</small>
          </button>)}
        </div>
      </div>
    </div>
  </section>;
}

export function SkillModal({ skill, onClose }) {
  const matches = projects.filter((project) => project.tools.includes(skill.name));
  return <Modal eyebrow={skill.category.toUpperCase()} title={skill.name} onClose={onClose}>
    <p>{skill.description}</p>
    <h3>관련 프로젝트</h3>
    {matches.length ? <ul>{matches.map((project) => <li key={project.id}>{project.title}</li>)}</ul>
      : skill.name === 'Tailwind CSS' ? <ul><li>SHIN NARA Portfolio · SCSS로 구현한 스타일링 비교 사례</li></ul>
      : <p>이 포트폴리오에서 연결된 프로젝트가 없습니다.</p>}
  </Modal>;
}
