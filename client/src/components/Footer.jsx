import { nav, site } from '../data/content.js';
import Wordmark from './Wordmark.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <p className="footer__line">
          Kézműves gluténmentes pizzéria és pékség
          <br />
          {site.address}
        </p>
        <ul className="footer__links">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
          <li>
            <a href={site.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </li>
        </ul>
      </div>
      <p className="footer__mark" aria-hidden="true">
        <Wordmark />
      </p>
      <p className="wrap footer__legal">© {new Date().getFullYear()} glutiliNO. Minden ételünk gluténmentes.</p>
    </footer>
  );
}
