import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Copy, Github, Mail, Phone } from 'lucide-react';
import { contact } from '../data/site';
import { SectionTitle } from './UI';

export function Contact() {
  const [toast, setToast] = useState('');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(contact.email);
      setToast('이메일 주소를 복사했습니다.');
    } catch {
      setToast('이메일 주소를 복사할 수 없습니다.');
    }
    timer.current = setTimeout(() => setToast(''), 3000);
  }
  return <section className="contact paper-section" id="contact" aria-labelledby="contact-title">
    <div className="shell contact-grid">
      <SectionTitle label="05. CONTACT" title="Let’s Connect" id="contact-title" />
      <p data-reveal>협업이나 프로젝트에 관한<br /> 이야기를 나눌 수 있기를 바랍니다.</p>
      <address data-reveal>
        <div><Mail size={20} strokeWidth={1.5} aria-hidden="true" />
          {contact.email ? <><a href={`mailto:${contact.email}`}>{contact.email}</a>
            <button className="round copy-email" aria-label="이메일 복사" onClick={copyEmail}><Copy size={14} /></button></>
            : <span>이메일 미연결</span>}
        </div>
        {contact.github && <div><Github size={20} strokeWidth={1.5} aria-hidden="true" />
          <a href={contact.github} target="_blank" rel="noreferrer">GitHub</a></div>}
        <div><Phone size={20} strokeWidth={1.5} aria-hidden="true" />
          {contact.phone ? <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a> : <span>연락처 미연결</span>}</div>
      </address>
      <a href="#home" className="round top-link" aria-label="맨 위로"><ArrowUp size={17} /></a>
    </div>
    <div role="status" className={toast ? 'toast is-visible' : 'toast'}>{toast}</div>
  </section>;
}

export function Footer() {
  return <footer className="site-footer"><div className="shell footer-inner">
    <a href="#home" className="wordmark">SHIN NARA</a>
    <p className="eyebrow">WEB PUBLISHER PORTFOLIO</p><small>© 2026. SHIN NARA</small>
  </div></footer>;
}
