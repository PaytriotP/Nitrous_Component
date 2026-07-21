import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const gaugeRef = useRef<SVGSVGElement>(null);
  const [psi, setPsi] = useState(0);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReduced && gaugeRef.current) {
      const timer = setTimeout(() => {
        gaugeRef.current?.classList.add('gauge-loaded');
        
        let startTimestamp: number | null = null;
        const duration = 1500;
        const targetPsi = 142; // arbitrary target PSI
        const targetLines = 12400;

        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
          
          setPsi(Math.floor(easeProgress * targetPsi));
          setLines(Math.floor(easeProgress * targetLines));
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      if (gaugeRef.current) gaugeRef.current.classList.add('gauge-loaded');
      setPsi(142);
      setLines(12400);
    }
  }, []);

  return (
    <div className="hero">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow">UK Electronics Components</p>
          <h1>Components at <span className="volt">full pressure</span></h1>
          <p>Semiconductors, passives, connectors and boards — picked, packed and dispatched same day. Real stock. Comprehensive datasheets. No filler.</p>
          <div className="hero-ctas">
            <Link to="/shop" className="btn btn-primary">Boost your build</Link>
            <Link to="/shop" className="btn btn-secondary">Browse categories</Link>
          </div>
          <div className="hero-meta">
            <span><strong>{lines.toLocaleString()}+</strong> lines in stock</span>
            <span><strong>3pm</strong> same-day cutoff</span>
            <span><strong>4.9★</strong> rated service</span>
          </div>
        </div>
        <div className="gauge-wrap">
          <svg ref={gaugeRef} className="gauge" id="gauge" viewBox="0 0 300 210" role="img" aria-label="Stock pressure gauge at full">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#5B6812"/>
                <stop offset=".7" stopColor="#9CB426"/>
                <stop offset="1" stopColor="#D8F633"/>
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Concentric back rings */}
            <path d="M24 172 A134 134 0 1 1 276 172" fill="none" stroke="#0B0E14" strokeWidth="20" strokeLinecap="round"/>
            <path d="M40 172 A118 118 0 1 1 260 172" fill="none" stroke="#1D2536" strokeWidth="14" strokeLinecap="round"/>
            
            {/* Animated filling arc */}
            <path className="gauge-arc" d="M40 172 A118 118 0 1 1 260 172" fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round" />
            
            {/* Ticks */}
            <g stroke="#8A94A8" strokeWidth="2">
              <line x1="52" y1="160" x2="62" y2="152"/>
              <line x1="66" y1="92" x2="75" y2="99"/>
              <line x1="118" y1="46" x2="122" y2="57"/>
              <line x1="185" y1="47" x2="181" y2="58"/>
              <line x1="236" y1="94" x2="227" y2="101"/>
              <line x1="248" y1="160" x2="238" y2="152"/>
            </g>
            
            {/* Soft radial glow behind needle */}
            <circle cx="150" cy="150" r="24" fill="rgba(47,183,255,0.15)" filter="url(#glow)"/>
            
            {/* Needle */}
            <g className="gauge-needle">
              <path d="M150 150 L150 52" stroke="#F2F5F9" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="150" cy="150" r="10" fill="#2FB7FF"/>
              <circle cx="150" cy="150" r="4" fill="#0B0E14"/>
            </g>
            
            {/* Text elements */}
            <text x="150" y="194" textAnchor="middle" fontFamily="'Chakra Petch',sans-serif" fontWeight="600" fontSize="13" letterSpacing="2" fill="#8A94A8">STOCK PRESSURE</text>
            <text x="150" y="112" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="28" fontWeight="600" fill="#FFFFFF">{psi}</text>
            <text x="150" y="132" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="#8A94A8">PSI</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
