import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import FlourParticles from './components/FlourParticles.jsx';
import Nav from './components/Nav.jsx';
import ScrollyHero from './components/ScrollyHero.jsx';
import Safety from './components/Safety.jsx';
import Menu from './components/Menu.jsx';
import Bakery from './components/Bakery.jsx';
import Story from './components/Story.jsx';
import Reviews from './components/Reviews.jsx';
import Visit from './components/Visit.jsx';
import Footer from './components/Footer.jsx';
import FactToast from './components/FactToast.jsx';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip" href="#mentes">Ugrás a tartalomra</a>
      <FlourParticles />
      <Nav />
      <main>
        <ScrollyHero />
        <Safety />
        <Menu />
        <Bakery />
        <Story />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <FactToast />
    </>
  );
}
