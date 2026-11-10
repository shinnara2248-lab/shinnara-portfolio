import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About, AboutModal } from './components/About';
import { Skills, SkillModal } from './components/Skills';
import { Projects, ProjectModal } from './components/Projects';
import { Resume, ResumeModal } from './components/Resume';
import { Contact, Footer } from './components/Contact';
import { sections } from './data/site';

gsap.registerPlugin(ScrollTrigger);

function useVoyage(root, progress) {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  useLayoutEffect(() => {
    const match = gsap.matchMedia(root);
    match.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-enter', { autoAlpha: 0, y: 18, stagger: .09, duration: .8, ease: 'power2.out', clearProps: 'all' });
      gsap.to('.hero-parallax', { yPercent: 9, ease: 'none',
        scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: .7 } });
      root.current.querySelectorAll('main section:not(.hero)').forEach((section) => {
        section.querySelectorAll('[data-reveal]').forEach((element, index) => {
          gsap.from(element, { opacity: 0, y: 12, delay: Math.min(index, 4) * .055, duration: .62,
            clearProps: 'opacity,transform', scrollTrigger: { trigger: element, start: 'top 95%', once: true } });
        });
      });
    });
    // Mobile browsers vary in their support for fixed backgrounds.
    match.add('(pointer: coarse) and (prefers-reduced-motion: no-preference)', () => {
      root.current.querySelectorAll('.sea-parallax').forEach((section) => {
        gsap.fromTo(section, { '--sea-scroll': '28%' }, {
          '--sea-scroll': '72%', ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
    return () => match.revert();
  }, [root]);

  useEffect(() => {
    const nodes = sections.map(([id]) => document.getElementById(id));
    const observer = new IntersectionObserver(([entry]) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    observer.observe(root.current.querySelector('[data-orbit]'));
    let frame = 0;
    let bottomDestination = location.hash === '#resume' ? 'resume' : 'contact';
    function update() {
      frame = 0;
      const top = window.scrollY;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      progress.current.style.transform = `scaleX(${limit > 0 ? Math.min(1, top / limit) : 0})`;
      setScrolled(top > 28);
      const current = limit > 0 && top >= limit - 3 ? document.getElementById(bottomDestination)
        : nodes.findLast((node) => node.getBoundingClientRect().top <= Math.min(window.innerHeight * .33, 205));
      setActive(current?.id || 'home');
    }
    function queueUpdate() { if (!frame) frame = requestAnimationFrame(update); }
    function onHashChange() {
      bottomDestination = location.hash === '#resume' ? 'resume' : 'contact';
      queueUpdate();
    }
    function onManualScroll() {
      bottomDestination = 'contact';
      queueUpdate();
    }
    update();
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('wheel', onManualScroll, { passive: true });
    window.addEventListener('touchmove', onManualScroll, { passive: true });
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    const layout = new ResizeObserver(queueUpdate);
    layout.observe(root.current);
    return () => {
      observer.disconnect();
      layout.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('wheel', onManualScroll);
      window.removeEventListener('touchmove', onManualScroll);
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
    };
  }, [root, progress]);
  return { active, scrolled };
}

export default function App() {
  const root = useRef(null);
  const progress = useRef(null);
  const { active, scrolled } = useVoyage(root, progress);
  const [dark, setDark] = useState(() => localStorage.getItem('oceanic-theme') === 'dark');
  const [modal, setModal] = useState(null);
  useEffect(() => { localStorage.setItem('oceanic-theme', dark ? 'dark' : 'light'); }, [dark]);
  const onClose = () => setModal(null);
  const onResume = () => setModal({ type: 'resume' });
  return <MotionConfig reducedMotion="user">
    <div ref={root} className="site" data-theme={dark ? 'dark' : 'light'}>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <Header active={active} scrolled={scrolled} dark={dark} onTheme={() => setDark(!dark)} progressRef={progress} />
      <main id="main-content" tabIndex={-1}>
        <Hero onResume={onResume} />
        <About onDetails={() => setModal({ type: 'about' })} />
        <Skills onSkill={(data) => setModal({ type: 'skill', data })} modalOpen={!!modal} />
        <Projects onProject={(data) => setModal({ type: 'project', data })} />
        <Resume onPreview={onResume} />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>
        {modal?.type === 'about' && <AboutModal key="about" onClose={onClose} />}
        {modal?.type === 'skill' && <SkillModal key="skill" skill={modal.data} onClose={onClose} />}
        {modal?.type === 'project' && <ProjectModal key="project" project={modal.data} onClose={onClose} />}
        {modal?.type === 'resume' && <ResumeModal key="resume" onClose={onClose} />}
      </AnimatePresence>
    </div>
  </MotionConfig>;
}
