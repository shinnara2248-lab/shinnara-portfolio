import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/css';
import { filters, projects } from '../data/projectsData';
import { Action, Modal, SectionTitle } from './UI';

function ProjectArt({ project }) {
  return <figure className={`project-art project-art--${project.id}`}>
    {project.image && <img src={project.image} alt={project.imageAlt} loading="lazy" draggable="false" />}
    <span className="art-name" aria-hidden="true">{project.id === 'ocean-portfolio' ? 'SHIN NARA' : project.title}</span>
  </figure>;
}

function TiltCover({ project, onOpen, active }) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 24 });
  function tilt(event) {
    if (reduce || event.pointerType !== 'mouse' || event.buttons) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateX.set((.5 - (event.clientY - rect.top) / rect.height) * 9);
    rotateY.set(((event.clientX - rect.left) / rect.width - .5) * 10);
  }
  return <motion.button type="button" className="project-cover" tabIndex={active ? 0 : -1}
    onClick={onOpen} aria-label={`${project.title} 자세히 보기`} onPointerMove={tilt}
    onPointerLeave={() => { rotateX.set(0); rotateY.set(0); }}
    style={{ rotateX, rotateY, transformPerspective: 950 }}>
    <ProjectArt project={project} />
    <span className="art-overlay">{project.title}<ArrowUpRight size={19} /></span>
  </motion.button>;
}

function ProjectLink({ project }) {
  if (!project.demo) return null;
  const internal = project.demo.startsWith('#');
  return <Action href={project.demo} icon={ArrowUpRight}
    {...(!internal && { target: '_blank', rel: 'noreferrer' })}>
    {internal ? '홈으로 이동' : '사이트 보기'}
  </Action>;
}

function Tags({ tools }) {
  return <ul className="tags" aria-label="사용 기술">{tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>;
}
const number = (value) => String(value).padStart(2, '0');

export function Projects({ onProject }) {
  const [filter, setFilter] = useState('All');
  const [index, setIndex] = useState(0);
  const swiper = useRef(null);
  const reduce = useReducedMotion();
  const visible = projects.filter((project) => filter === 'All' || project.categories.includes(filter));
  const preview = visible.slice(index + 1).concat(visible.slice(0, index));
  const atLastProject = index === visible.length - 1 && visible.length > 1;
  const nextLabel = atLastProject ? '첫 프로젝트로 돌아가기' : '다음 프로젝트';
  function nextProject() {
    const gallery = swiper.current;
    if (!gallery) return;
    if (gallery.activeIndex === visible.length - 1) gallery.slideTo(0);
    else gallery.slideNext();
  }
  return <section id="projects" className="projects paper-section" aria-labelledby="projects-title">
    <div className="shell">
      <div className="projects-heading">
        <SectionTitle label="03. PROJECTS" title="My Projects" id="projects-title" />
        <div className="project-filters" role="group" aria-label="프로젝트 카테고리" data-reveal>
          {filters.map((category) => <button key={category} type="button" aria-pressed={filter === category}
            onClick={() => { if (category !== filter) { setFilter(category); setIndex(0); } }}>{category}</button>)}
        </div>
      </div>
      <div className="gallery" data-reveal>
        <button type="button" className="round gallery-prev" aria-label="이전 프로젝트" disabled={visible.length < 2}
          onClick={() => swiper.current?.slidePrev()}><ArrowLeft size={19} /></button>
        <div className="gallery-body">
          <Swiper key={filter} modules={[A11y]} rewind speed={reduce ? 0 : 460} threshold={8}
            longSwipesRatio={.22} touchStartPreventDefault={false}
            focusableElements="input, select, option, textarea, video, label, .action"
            a11y={{ containerRoleDescriptionMessage: '프로젝트 갤러리', itemRoleDescriptionMessage: '프로젝트' }}
            onSwiper={(instance) => { swiper.current = instance; }}
            onSlideChange={(instance) => setIndex(instance.activeIndex)}>
            {visible.map((project, order) => <SwiperSlide key={project.id} aria-hidden={index !== order}>
              <div className="project-slide" inert={index !== order}>
                <TiltCover project={project} active={index === order} onOpen={() => onProject(project)} />
                <div className="project-description">
                  <p className="eyebrow">{number(order + 1)} <span>/</span> {number(visible.length)}</p>
                  <h3>{project.title}</h3>
                  {project.planned ? <p className="project-status">제작 예정</p> : <Tags tools={project.tools} />}
                  <div className="project-actions">
                    <Action className="action--line" onClick={() => onProject(project)}>프로젝트 자세히 보기</Action>
                    <ProjectLink project={project} />
                  </div>
                </div>
              </div>
            </SwiperSlide>)}
          </Swiper>
          <div className="project-deck" aria-label="다른 프로젝트">
            {preview.map((project, order) => <button type="button" key={project.id} style={{ '--deck-index': order }}
              onClick={() => swiper.current?.slideTo(visible.indexOf(project))} aria-label={`${project.title} 슬라이드로 이동`}>
              <ProjectArt project={project} />
            </button>)}
          </div>
        </div>
        <button type="button" className="round gallery-next" aria-label={nextLabel} title={nextLabel} disabled={visible.length < 2}
          onClick={nextProject}><ArrowRight size={19} /></button>
        <div className="project-pagination" role="group" aria-label="프로젝트 슬라이드 선택">
          {visible.map((project, order) => <button type="button" key={project.id}
            aria-label={`${project.title} 선택`} aria-current={index === order ? 'true' : undefined}
            onClick={() => swiper.current?.slideTo(order)}><span /></button>)}
        </div>
      </div>
    </div>
  </section>;
}

function ProjectPreview({ project }) {
  if (!project.demo || new URLSearchParams(window.location.search).has('project-preview')) {
    return <>
      <ProjectArt project={project} />
      <p className="asset-credit">{project.credit}</p>
      <ProjectLink project={project} />
    </>;
  }

  const url = new URL(project.demo, window.location.href);
  if (url.origin === window.location.origin) url.searchParams.set('project-preview', '1');
  return <div className="project-live">
    <div className="project-live-bar">
      <p>실제 사이트 미리보기</p>
      <a href={project.demo} target="_blank" rel="noreferrer">새 탭에서 열기 <ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
    <iframe src={url.href} title={`${project.title} 실제 사이트 미리보기`} referrerPolicy="no-referrer" />
  </div>;
}

export function ProjectModal({ project, onClose }) {
  if (project.planned) return <Modal title={project.title} eyebrow="제작 예정" onClose={onClose} wide>
    <ProjectArt project={project} />
    <p>{project.summary}</p>
  </Modal>;

  return <Modal title={project.title} eyebrow={project.categories.join(' / ')} onClose={onClose} wide className="modal--project">
    <div className="project-detail-layout">
      <p className="project-detail-summary">{project.summary}</p>
      <div className="project-detail-preview"><ProjectPreview project={project} /></div>
      <div className="project-detail-info">
        <dl className="project-facts">
          <div><dt>작업 기간</dt><dd>{project.period || '미제공'}</dd></div>
          <div><dt>참여 범위</dt><dd>{project.scope}</dd></div>
          <div><dt>사용 기술</dt><dd><Tags tools={project.tools} /></dd></div>
        </dl>
        <h3>구현 과정</h3>
        <ol>{project.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        {project.repository && <div className="modal-actions">
          <Action href={project.repository} icon={ArrowUpRight} target="_blank" rel="noreferrer">GitHub</Action>
        </div>}
      </div>
    </div>
  </Modal>;
}
