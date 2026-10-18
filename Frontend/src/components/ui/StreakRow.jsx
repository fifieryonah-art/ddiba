import Icon from "./Icon";

export default function StreakRow({ activeDays = 4 }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="streak-row">
      {days.map((day, i) => (
        <div key={`${day}-${i}`} className="streak-day">
          <span>{day}</span>
          <div className={`streak-dot ${i < activeDays ? "active" : ""}`}>
            {i < activeDays ? <Icon name="flame" /> : i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
