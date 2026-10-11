// Ideiglenes szöveges logó – a végleges SVG logó ide cserélhető.
export default function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="sr-only">glutiliNO</span>
      <span aria-hidden="true">glutili</span>
      <span className="wordmark__no" aria-hidden="true">NO</span>
    </span>
  );
}
