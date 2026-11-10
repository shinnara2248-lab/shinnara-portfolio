import { Code2, Laptop, TrendingUp } from 'lucide-react';
import { media } from '../data/site';
import { Action, Modal, SectionTitle } from './UI';

const values = [
  [Laptop, 'Design & Publish', '디자인 의도를 이해하고, 웹에서 작동하는 화면으로 구현합니다.'],
  [Code2, 'User Experience', '사용자 흐름을 고려해 편안하게 탐색할 수 있는 구조를 설계합니다.'],
  [TrendingUp, 'Learn & Grow', '새로운 기술을 꾸준히 배우고 다양한 방식으로 적용해 봅니다.'],
];

export function About({ onDetails }) {
  return <section id="about" className="about paper-section" aria-labelledby="about-title">
    <div className="shell about-grid">
      <div>
        <SectionTitle label="01. ABOUT ME" title="My Voyage" id="about-title" />
        <p className="section-copy" data-reveal>안녕하세요. 웹퍼블리셔 신나라입니다.<br />사용자의 경험을 깊이 고민하고, 디자인과 코드로 더 나은 웹 경험을 만들어갑니다.</p>
        <Action onClick={onDetails} data-reveal>자세히 보기</Action>
      </div>
      <figure className="about-portrait" data-reveal>
        <div className={`portrait-frame ${media.profile ? 'portrait-frame--profile' : ''}`}><img src={media.profile || media.waves}
          alt={media.profile ? '웹퍼블리셔 신나라 프로필' : '햇빛이 반사되는 짙은 푸른 파도'} loading="lazy" /></div>
        <span className="portrait-star" aria-hidden="true">✧</span>
        <figcaption>FIG. 01 <span /> {media.profile ? 'SHIN NARA' : 'THE OCEAN STUDY'}</figcaption>
      </figure>
      <div className="about-values">
        {values.map(([Icon, title, copy]) => <div className="about-value" key={title} data-reveal>
          <Icon size={28} strokeWidth={1.2} aria-hidden="true" /><div><h3>{title}</h3><p>{copy}</p></div>
        </div>)}
      </div>
    </div>
  </section>;
}

export function AboutModal({ onClose }) {
  return <Modal className="about-dialog" eyebrow="01. ABOUT ME" title="My Voyage" onClose={onClose}>
    <p>안녕하세요. 웹퍼블리셔 신나라입니다.</p>
    <p>사용자의 경험을 깊이 고민하고, 디자인과 코드를 통해 더 나은 웹 경험을 만들어가고 싶습니다.</p>
    <p>새로운 기술을 배우고 다양한 시도를 즐기며, 꾸준히 성장하는 개발자가 되는 것이 목표입니다.</p>
  </Modal>;
}
