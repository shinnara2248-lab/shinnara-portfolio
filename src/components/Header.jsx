import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { sections } from '../data/site';

export function ScrollProgress({ progressRef }) {
  return <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>;
}

export function Header({ active, scrolled, dark, onTheme, progressRef }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return <header className={`site-header ${scrolled || open ? 'site-header--solid' : ''}`}>
    <div className="shell header-inner">
      <a className="wordmark" href="#home" onClick={() => setOpen(false)}>SHIN NARA</a>
      <nav id="main-nav" className={open ? 'is-open' : ''} aria-label="주 메뉴">
        {sections.map(([id, name]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}
          aria-current={active === id ? 'location' : undefined}>{name}</a>)}
      </nav>
      <div className="header-actions">
        <button type="button" className="theme-toggle" onClick={onTheme} aria-label="다크 모드" aria-pressed={dark}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button type="button" className="menu-toggle" id="menu-toggle" aria-expanded={open} aria-controls="main-nav"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'} onClick={() => setOpen(!open)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </div>
    <ScrollProgress progressRef={progressRef} />
  </header>;
}
