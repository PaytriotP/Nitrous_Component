const { useScene, interpolate, Easing } = window;

function Reveal() {
  const { localTime } = useScene();
  const t = localTime;

  const hexP = interpolate([0, 0.5], [0, 1], Easing.easeOutCubic)(t);
  const boltScaleRaw = interpolate([0.35, 0.75, 0.9], [0, 1.12, 1], [Easing.easeOutBack, Easing.easeOutCubic])(t);
  const boltOpacity = interpolate([0.35, 0.55], [0, 1])(t);

  const flash = interpolate([0.7, 0.85, 1.15], [0, 1, 0])(t);

  const wordT = interpolate([0.95, 1.35], [0, 1], Easing.easeOutCubic)(t);
  const wordY = interpolate([0, 1], [14, 0])(wordT);
  const compT = interpolate([1.15, 1.55], [0, 1], Easing.easeOutCubic)(t);
  const compY = interpolate([0, 1], [14, 0])(compT);

  const hexDash = 292;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0b0c0e'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 96, height: 96, position: 'relative' }}>
          <svg viewBox="0 0 100 100" width={96} height={96} style={{ display: 'block', overflow: 'visible' }}>
            <polygon points="50,3 92,26 92,74 50,97 8,74 8,26"
              fill="none" stroke="#F4F6F8" strokeWidth={5} strokeLinejoin="round"
              strokeDasharray={hexDash} strokeDashoffset={hexDash * (1 - hexP)} />
            <g style={{ transform: `translate(50px,50px) scale(${boltScaleRaw}) translate(-50px,-50px)`, opacity: boltOpacity }}>
              <polygon points="58,20 30,56 48,56 42,82 72,44 52,44" fill="#19A8FF" />
            </g>
            <circle cx="76" cy="30" r={10 + flash * 6} fill="#D8FF3D" opacity={flash * 0.9} />
          </svg>
        </div>
        <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          <span style={{ color: '#F4F6F8', display: 'inline-block', opacity: wordT, transform: `translateY(${wordY}px)` }}>NITROUS</span>{' '}
          <span style={{ color: '#19A8FF', display: 'inline-block', opacity: compT, transform: `translateY(${compY}px)` }}>COMPONENTS</span>
        </div>
      </div>
    </div>
  );
}

window.Reveal = Reveal;
