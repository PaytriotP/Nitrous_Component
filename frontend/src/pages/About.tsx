import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Factory } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <hr className="pressure-rule" />
      
      <div className="about-hero">
        <div className="container about-hero-container">
          <h1 className="text-h1">The performance-parts mentality, applied to electronics retail.</h1>
        </div>
      </div>

      <div className="container about-content">
        <section className="about-story">
          <h2 className="text-h2">Our Story</h2>
          <div className="prose">
            <p>Nitrous was born from the frustration of modern hardware engineering. Sourcing reliable components often meant navigating clunky legacy distributor websites, bloated search interfaces, and unacceptable shipping lead times. We knew there was a better way.</p>
            <p>Inspired by the precision and energy of aftermarket automotive tuning shops, we built Nitrous to be the ultimate streamlined distributor. We treat every micro-controller, MOSFET, and resistor with the discipline it deserves.</p>
            <p>We are not a massive catalog of every part ever made. We are a curated, highly disciplined inventory of the exact components you need to get your prototype off the bench and into the real world.</p>
          </div>
        </section>

        <section className="about-quality">
          <h2 className="text-h2">Quality Assurance</h2>
          <div className="quality-grid">
            <div className="quality-card">
              <ShieldCheck size={32} className="text-nitro-blue" />
              <h3 className="text-h3">Zero Grey Market</h3>
              <p className="text-steel-400 text-small">Every component is sourced exclusively through verified manufacturer channels. No counterfeits, no exceptions.</p>
            </div>
            <div className="quality-card">
              <Factory size={32} className="text-nitro-blue" />
              <h3 className="text-h3">Climate-Controlled</h3>
              <p className="text-steel-400 text-small">Our facility maintains strict ESD and humidity protocols. Moisture-sensitive devices are baked and vacuum-sealed.</p>
            </div>
            <div className="quality-card">
              <Zap size={32} className="text-nitro-blue" />
              <h3 className="text-h3">Instant Dispatch</h3>
              <p className="text-steel-400 text-small">If the badge says 'PRESSURISED', the part is physically on our shelves and ready to ship within hours.</p>
            </div>
          </div>
        </section>

        <div className="about-cta">
          <Link to="/shop">
            <button className="btn-primary" style={{ padding: '0 var(--space-8)' }}>
              Enter the Shop <ArrowRight size={18} style={{ marginLeft: 'var(--space-2)' }} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
