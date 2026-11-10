# SHIN NARA — OCEANIC EXPLORER

신나라 웹퍼블리셔 원페이지 포트폴리오. 참고 디자인의 네이비·아이보리 대비와 6개 섹션을 바탕으로 구현했습니다. 바다 배경에는 사용자가 첨부한 황금빛 파도 이미지를 사용했습니다.

## 실행

Node.js 22.12 이상 환경에서 아래 명령을 실행합니다.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다.

## 첨부 ZIP 분석

- 전체 ZIP에는 6,810개 항목이 있었습니다. Git 내부 파일과 설치 캐시, 디렉터리를 제외한 파일 897개를 분류했습니다.
- `01.html`, `02.css`에 마크업과 해비치 웹 실습, `03.javascrpt`에 GSAP 실습, `05.react`에 React 샘플과 포트폴리오, `06.typescript`·`07.react-typescript`·`08.scss`에 타입 및 스타일 실습이 있습니다.
- `05.react/06-portfolio`는 Vite에서 시작해 React Router의 Layout 아래 페이지를 배치합니다. 스타일은 `App.scss`, `App.css`, `index.css`로 나뉘고 이미지와 샘플 데이터는 `public/images`, `src/assets`, `src/data`에 있습니다.
- 해비치 프로젝트의 테라스 사진을 재사용했습니다. Swiper의 슬라이드 구성과 공통 타이틀 패턴을 프로젝트 갤러리에 맞게 바꿨습니다. GSAP 실습의 ScrollTrigger 등록과 타임라인 구조를 참고해 원페이지에 맞는 애니메이션을 작성했습니다.
- 쇼핑몰 컴포넌트, 로그인, Firebase, Zustand, 예제 라우팅은 이 원페이지에서 사용하지 않습니다. 첨부 압축의 기존 소스는 별도로 보존했습니다.
- 신규 앱은 React, Vite, Sass, Swiper를 사용하며 GSAP/ScrollTrigger, Framer Motion, Lucide React를 추가했습니다. Pretendard와 Playfair Display는 로컬로 번들링하고 Simple Icons를 기술 아이콘에 사용했습니다.

## 폴더 구조

```text
src/
  App.jsx                  섹션 연결, 스크롤 상태, 모달 및 테마
  main.jsx                 React 진입점과 폰트
  assets/
    ocean/                 첨부 파도 사진
    projects/              프로젝트 이미지
  components/              여섯 섹션, 내비게이션, 공통 UI
  data/                    기술, 프로젝트, 사이트 설정
  scss/
    main.scss              전역 스타일
    _variables.scss        색상과 타이포그래피
    _mixins.scss           공통 바다 배경
    components/            섹션·공통 컴포넌트별 스타일
public/                    정적 파일과 파비콘
```

## 실제 자료 연결

| 항목 | 수정 위치 |
| --- | --- |
| 프로필 이미지 | `src/data/site.js`에서 이미지를 import하고 `media.profile`에 지정 |
| 이메일, 전화번호, 개인 GitHub | `src/data/site.js`의 `contact` |
| 이력서 PDF | `src/assets/resume/`에 PDF를 넣고 `src/data/site.js`에서 `?url`로 가져와 `resume.pdf`에 지정 |
| 이력서 대표 이미지 | `src/assets/resume/`에 원본 PDF에서 렌더링한 페이지 이미지를 넣고 `src/data/site.js`의 `resume.pages`에 페이지 순서대로 지정 |
| 프로젝트 대표 이미지, 작업 기간, 참여 범위, 링크 | `src/data/projectsData.js`의 `image`, `imageAlt`, `credit`, `period`, `scope`, `demo`, `repository` |
| 기술 설명과 분류 | `src/data/skillsData.js`에서 수정. 관련 프로젝트는 `projectsData.js`의 `tools`와 이름이 일치할 때 표시 |

Apple TV와 BYHEYDEY는 첨부 디자인의 목업 일부를 임시 대표 이미지로 사용합니다. 해비치는 ZIP 내 프로젝트 사진을 사용합니다. 이력서 섹션에서는 첫 페이지를 보여주며, 미리보기 모달에서 전체 페이지와 원본 PDF를 열 수 있습니다. 이메일 값이 입력되면 메일 앱 링크와 복사 버튼이 나타납니다. 클립보드 API는 HTTPS 또는 localhost에서 사용할 수 있습니다.
