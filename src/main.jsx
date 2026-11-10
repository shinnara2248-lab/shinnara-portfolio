import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './scss/main.scss';
import App from './App';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
