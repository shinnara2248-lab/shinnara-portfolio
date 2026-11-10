import apple from '../assets/projects/apple-tv.webp';
import byheydey from '../assets/projects/byheydey.webp';
import haevichi from '../assets/projects/haevichi.webp';
import { media } from './site';

export const filters = ['All', 'UI/UX', 'Web', 'Renewal'];
export const projects = [
  {
    id: 'ocean-portfolio', title: 'SHIN NARA Portfolio', categories: ['Web'],
    image: media.waves, imageAlt: '달빛이 비치는 파도와 SHIN NARA 포트폴리오', credit: '현재 포트폴리오',
    summary: '깊은 바다와 항해를 테마로, 디자인과 코드 작업을 하나의 흐름으로 소개하는 인터랙티브 포트폴리오입니다.',
    scope: 'UXUI 디자인, 개발', period: '',
    tools: ['React', 'SCSS', 'JavaScript', 'GSAP', 'Framer Motion', 'Swiper', 'Git', 'GitHub', 'Figma'],
    steps: ['디자인 레퍼런스에 맞춰 여섯 섹션의 구조를 설계했습니다.', '기술 궤도, 프로젝트 갤러리, 이력서 모달을 구현했습니다.', '반응형 레이아웃과 키보드 조작을 검수했습니다.'],
    demo: '#home', repository: '',
  },
  {
    id: 'haevichi', title: 'HAEVICHI', categories: ['UI/UX', 'Web'],
    image: haevichi, imageAlt: '위에서 내려다본 해비치 수영장과 야자수', credit: '첨부 프로젝트 이미지',
    summary: '호텔 브랜드 해비치의 고급스럽고 여유로운 분위기를 살려 웹사이트를 리디자인했습니다. 객실, 다이닝, 부대시설 등 다양한 정보를 직관적으로 탐색할 수 있도록 콘텐츠를 구성하고, 제주의 자연과 휴식이라는 브랜드 가치를 시각적으로 전달하는 데 중점을 두었습니다.',
    scope: '개발', period: '', tools: ['HTML5', 'CSS3', 'JavaScript', 'Swiper', 'AOS', 'Git', 'GitHub', 'Figma'],
    steps: ['공간과 서비스 정보를 탐색 흐름에 따라 정리했습니다.', '사진과 설명의 관계를 고려해 화면을 구성했습니다.'],
    demo: 'https://hellolucy0901.github.io/team-haevichi/index.html', repository: '',
  },
  {
    id: 'byheydey', title: 'BYHEYDEY', categories: ['Renewal'],
    image: byheydey, imageAlt: '햇빛이 비치는 공간에 놓인 바이헤이데이 검은 가죽 소파', credit: '첨부 프로젝트 이미지',
    summary: '가구 브랜드 BYHEYDEY의 기존 아이덴티티를 살리면서 세련되고 직관적인 UI로 리디자인했습니다. 상품 탐색과 콘텐츠 구성을 개선하고 브랜드만의 감성을 시각적으로 전달하는 데 중점을 두었습니다.',
    scope: '와이어프레임, UXUI 디자인, 개발', period: '', tools: ['HTML5', 'CSS3', 'JavaScript', 'Swiper', 'AOS', 'Git', 'GitHub', 'Figma'],
    steps: ['브랜드와 제품을 보여주는 순서를 정리했습니다.', '이미지가 중심이 되는 화면을 구성하고 탐색 인터랙션을 구현했습니다.'],
    demo: 'https://wjdqhal.github.io/byheydey-fin/index.html', repository: '',
  },
  {
    id: 'apple-tv', title: 'Apple TV', categories: ['Renewal'],
    image: apple, imageAlt: 'Apple TV 프로젝트의 슬로 호시스 메인 화면', credit: '첨부 프로젝트 이미지',
    summary: 'OTT 콘텐츠를 쉽고 편리하게 탐색할 수 있도록 제작한 웹사이트입니다. TMDB API를 연동해 영화와 TV 프로그램 정보를 제공하고, 직관적인 UI와 사용자 중심의 기능을 통해 자연스러운 콘텐츠 탐색 경험을 구현했습니다.',
    scope: '상세&AI UXUI 디자인, 개발', period: '',
    tools: ['React', 'JavaScript', 'SCSS', 'Vite', 'React Router', 'Zustand', 'Swiper', 'TMDB API', 'Git', 'GitHub', 'Figma'],
    steps: ['콘텐츠 탐색 흐름과 검색 결과 상태를 정리했습니다.', '취향 선택을 반영하는 AI 추천 UI를 설계하고 화면에 연결했습니다.', '찜 목록을 그룹으로 나눠 저장한 콘텐츠를 관리할 수 있게 구성했습니다.'],
    demo: 'https://my-ott-tv-khaki.vercel.app/', repository: '',
  },
  {
    id: '29cm', title: '29CM', categories: [], planned: true,
    summary: '29CM 프로젝트는 제작 예정입니다.',
    tools: [],
  },
  {
    id: 'lenubele', title: "Le' Nubele", categories: ['Renewal'], planned: true,
    summary: "Le' Nubele 프로젝트는 제작 예정입니다.",
    tools: [],
  },
];
