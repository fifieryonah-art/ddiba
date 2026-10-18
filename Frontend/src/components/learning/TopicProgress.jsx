import ProgressBar from "../ui/ProgressBar";

export default function TopicProgress({ name, value, note }) {
  return (
    <div className="topic-progress">
      <div className="topic-progress-head">
        <strong>{name}</strong>
        <span>{note || `${value}%`}</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}
