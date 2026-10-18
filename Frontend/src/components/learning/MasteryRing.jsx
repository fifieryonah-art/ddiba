export default function MasteryRing({ value = 80, label = "Mastery" }) {
  const deg = Math.max(0, Math.min(100, value)) * 3.6;
  return (
    <div
      className="mastery-ring"
      style={{ background: `conic-gradient(var(--primary) ${deg}deg, #e9e6f8 ${deg}deg)` }}
    >
      <div className="mastery-ring-inner">
        <strong>{value}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
