export default function ProgressBar({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-track" aria-label={`${safe}% complete`}>
      <div className="progress-fill" style={{ width: `${safe}%` }} />
    </div>
  );
}
