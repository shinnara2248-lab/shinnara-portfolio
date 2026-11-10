import waves from '../assets/ocean/moonlit-waves-wide.webp';
import heroWaves from '../assets/ocean/silver-waves.jpg';
import moon from '../assets/ocean/silver-moon-render.webp';
import profile from '../assets/profile/shin-nara-portrait.png';
import resumePdf from '../assets/resume/shin-nara-resume.pdf?url';
import resumePage1 from '../assets/resume/page-1.webp';
import resumePage2 from '../assets/resume/page-2.webp';
import resumePage3 from '../assets/resume/page-3.webp';
import resumePage4 from '../assets/resume/page-4.webp';

export const media = { waves, heroWaves, moon, profile };
export const contact = { email: 'shinnara2248@gmail.com', github: '', phone: '010-5248-5641' };
export const resume = {
  pdf: resumePdf,
  pages: [resumePage1, resumePage2, resumePage3, resumePage4],
};
export const sections = [
  ['home', 'Home'], ['about', 'About'], ['skills', 'Skills'],
  ['projects', 'Projects'], ['resume', 'Resume'], ['contact', 'Contact'],
];
