// DEV ONLY — remove before final deploy
import { STATES } from '../hooks/useActFlow';

export function SkipButton({ currentIndex, goTo }) {
  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <select
        value={currentIndex}
        onChange={e => goTo(Number(e.target.value))}
        style={{ background: '#222', color: '#fff', border: '1px solid #FF1493', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}
      >
        {STATES.map((s, i) => (
          <option key={s} value={i}>{i}: {s}</option>
        ))}
      </select>
    </div>
  );
}
