import html5 from '../assets/skills/html5.webp';
import javascript from '../assets/skills/javascript.webp';
import react from '../assets/skills/react.webp';
import git from '../assets/skills/git.webp';
import illustrator from '../assets/skills/illustrator.webp';
import photoshop from '../assets/skills/photoshop.webp';
import figma from '../assets/skills/figma.webp';
import github from '../assets/skills/github.webp';
import tailwind from '../assets/skills/tailwind.webp';
import sass from '../assets/skills/sass.webp';
import css3 from '../assets/skills/css3.webp';

export const skills = [
  ['HTML5', 'Markup', html5, '의미에 맞는 요소를 사용해 문서의 구조와 탐색 흐름을 만듭니다.'],
  ['JavaScript', 'Script', javascript, '이벤트와 상태를 연결해 탐색, 필터, 인터랙션을 구현합니다.'],
  ['React', 'Script', react, '화면을 컴포넌트 단위로 나누고 데이터와 상태에 맞춰 UI를 구성합니다.'],
  ['Git', 'Tools', git, '작업 단위를 커밋으로 기록하고 브랜치에서 변경 사항을 관리합니다.'],
  ['Illustrator', 'Design', illustrator, '벡터 그래픽과 로고를 제작하는 디자인 도구입니다.'],
  ['Photoshop', 'Design', photoshop, '이미지를 보정하고 웹에 적합한 시각 에셋을 준비하는 도구입니다.'],
  ['Figma', 'Design', figma, '화면 흐름과 반응형 UI를 설계하고 컴포넌트로 정리합니다.'],
  ['GitHub', 'Tools', github, '저장소와 풀 리퀘스트를 중심으로 프로젝트 변경 사항을 공유합니다.'],
  ['Tailwind CSS', 'Styling', tailwind, '유틸리티 클래스를 조합해 화면을 구성하는 CSS 프레임워크입니다.'],
  ['SCSS', 'Styling', sass, '스타일을 섹션과 컴포넌트 단위로 분리하고 공통 값을 관리합니다.'],
  ['CSS3', 'Markup', css3, '그리드, 플렉스, 미디어 쿼리를 이용해 반응형 레이아웃을 구성합니다.'],
].map(([name, category, icon, description]) => ({ name, category, icon, description }));
