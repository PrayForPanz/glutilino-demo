import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { glossary } from '../data/content.js';

/** Kis üveg-tooltip egy fogalomhoz. Egérrel, billentyűzettel és érintéssel is működik. */
export function Tip({ id, children }) {
  const entry = glossary[id];
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const [below, setBelow] = useState(false);
  const wrap = useRef(null);
  const pop = useRef(null);
  const tipId = useId();

  useLayoutEffect(() => {
    if (!open || !pop.current) return;
    const r = pop.current.getBoundingClientRect();
    const pad = 12;
    let dx = 0;
    if (r.left < pad) dx = pad - r.left;
    else if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
    setShift(dx);
    setBelow(r.top < 80);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setShift(0);
      setBelow(false);
      return;
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onDown = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  if (!entry) return children;

  return (
    <span
      ref={wrap}
      className="term"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        type="button"
        className="term__btn"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children ?? entry.term}
      </button>
      {open && (
        <span
          ref={pop}
          id={tipId}
          role="tooltip"
          className={`term__pop glass ${below ? 'is-below' : ''}`}
          style={{ '--shift': `${shift}px` }}
        >
          <span className="term__name">{entry.term}</span>
          {entry.body}
        </span>
      )}
    </span>
  );
}

/** Szöveg, amelyben a {kulcs} jelölők tooltippé alakulnak. */
export function Rich({ text }) {
  const parts = text.split(/\{(\w+)\}/g);
  return parts.map((p, i) =>
    i % 2 ? <Tip key={i} id={p} /> : <Fragment key={i}>{p}</Fragment>,
  );
}
