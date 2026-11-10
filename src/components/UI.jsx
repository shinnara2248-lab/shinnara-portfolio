import { useEffect, useId, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function SectionTitle({ label, title, id, children }) {
  return <div className="section-title">
    <p className="eyebrow" data-reveal>{label}</p>
    <h2 id={id} data-reveal>{title}</h2>
    {children && <p className="section-copy" data-reveal>{children}</p>}
  </div>;
}

export function Action({ href, children, icon = ArrowRight, className = '', ...props }) {
  const Icon = icon;
  const Component = href ? motion.a : motion.button;
  const reduce = useReducedMotion();
  return <Component {...(href ? { href } : { type: 'button' })} className={`action ${className}`}
    whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }} {...props}>
    {children}{Icon && <Icon size={16} aria-hidden="true" />}
  </Component>;
}

export function Modal({ eyebrow, title, onClose, children, wide = false, className = '' }) {
  const ref = useRef(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'modal--wide' : ''} ${className}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => {
      if (event.target === event.currentTarget) {
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
      }
    }}>
    <motion.div className="modal-panel" initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: 10 }} transition={{ duration: .18 }}>
      <button className="round modal-close" aria-label="닫기" onClick={onClose} autoFocus><X size={19} /></button>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
      {children}
    </motion.div>
  </dialog>;
}
