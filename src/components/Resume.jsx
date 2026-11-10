import { useState } from 'react';
import { Download, Minus, Plus } from 'lucide-react';
import { media, resume } from '../data/site';
import { Action, Modal, SectionTitle } from './UI';

function ResumeSheet() {
  const cover = resume.pages?.[0] || resume.image;
  if (cover) return <img className="resume-image" src={cover} width="1281" height="1813"
    loading="lazy" alt="신나라 이력서 첫 페이지" />;
  return <div className="resume-book">
    <div className="book-cover"><span>WEB PUBLISHER</span><strong>SHIN NARA</strong><em>Résumé</em><span>OCEANIC EXPLORER</span></div>
    <div className="book-page">
      <p className="book-label">01 / PROFILE</p><strong>신나라</strong><p>Web Publisher</p>
      <p className="book-label">02 / SELECTED SKILLS</p><p>HTML · CSS · JavaScript<br />React · SCSS · Figma</p>
      <p className="book-label">03 / SELECTED WORK</p><p>Apple TV · BYHEYDEY<br />HAEVICHI · Oceanic Explorer</p>
    </div>
  </div>;
}

function ResumeFan({ pages, onPreview }) {
  return <button className="resume-fan" type="button" onClick={onPreview}
    aria-label={`이력서 ${pages.length}페이지 미리보기`}>
    <span className="resume-fan-stage" aria-hidden="true">
      {pages.map((page, index) => {
        const offset = index - (pages.length - 1) / 2;
        return <img key={page} src={page} alt="" width="1281" height="1813" loading="lazy"
          style={{ '--page-offset': offset, '--page-distance': Math.abs(offset), zIndex: pages.length - index }} />;
      })}
    </span>
    <span className="resume-fan-count" aria-hidden="true">총 {pages.length}페이지</span>
  </button>;
}

function DownloadAction() {
  return resume.pdf
    ? <Action href={resume.pdf} icon={Download} download="shin-nara-resume.pdf" className="action--filled">PDF 다운로드</Action>
    : <Action disabled icon={Download} className="action--filled">PDF 다운로드</Action>;
}

export function Resume({ onPreview }) {
  const pages = resume.pages ?? [];
  return <section id="resume" className="resume sea-section sea-parallax" aria-labelledby="resume-title" style={{ '--sea': `url(${media.waves})` }}>
    <div className="shell resume-grid">
      <SectionTitle id="resume-title" label="04. RESUME" title="Resume">지금까지의 경험과 역량을 한눈에 확인할 수 있습니다.</SectionTitle>
      <div className="resume-mockup" data-reveal>
        <div className="resume-orbit" aria-hidden="true" />
        {pages.length > 1 ? <ResumeFan pages={pages} onPreview={onPreview} /> : <ResumeSheet />}
      </div>
      <div className="resume-actions" data-reveal>
        <Action onClick={onPreview}>이력서 미리보기</Action>
        <DownloadAction />
        {!resume.pdf && <small>PDF 미연결</small>}
      </div>
    </div>
  </section>;
}

export function ResumeModal({ onClose }) {
  const [zoom, setZoom] = useState(100);
  const pages = resume.pages ?? [];
  return <Modal eyebrow="04. RESUME" title="이력서 미리보기" wide onClose={onClose}>
    <div className="resume-toolbar" role="group" aria-label="미리보기 확대 및 축소">
      <button className="round" type="button" aria-label="축소" disabled={zoom === 75} onClick={() => setZoom(zoom - 25)}><Minus size={17} /></button>
      <output aria-live="polite">{zoom}%</output>
      <button className="round" type="button" aria-label="확대" disabled={zoom === 200} onClick={() => setZoom(zoom + 25)}><Plus size={17} /></button>
      <DownloadAction />
    </div>
    {resume.pdf && <a className="resume-original" href={resume.pdf} target="_blank" rel="noreferrer">원본 PDF 열기</a>}
    <div className="resume-reader" tabIndex={0} aria-label="이력서 미리보기 내용">
      <div style={{ width: `${zoom}%` }}>
        {pages.length ? <ol className="resume-pages" aria-label={`이력서 ${pages.length}페이지`}>
          {pages.map((page, index) => <li key={page}>
            <img className="resume-image" src={page} width="1281" height="1813"
              loading={index === 0 ? 'eager' : 'lazy'} alt={`신나라 이력서 ${index + 1}페이지`} />
          </li>)}
        </ol> : resume.pdf && !resume.image
          ? <object className="resume-pdf" data={resume.pdf} type="application/pdf" aria-label="신나라 이력서 PDF">
            <a href={resume.pdf} target="_blank" rel="noreferrer">이력서 PDF 열기</a>
          </object> : <ResumeSheet />}
      </div>
    </div>
    {!resume.pdf && <p className="asset-credit">현재 미리보기는 제공된 소개와 기술·프로젝트를 바탕으로 구성했습니다. PDF 파일은 미연결 상태입니다.</p>}
  </Modal>;
}
