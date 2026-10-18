import { useState } from "react";
import Button from "../ui/Button";

export default function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flashcard" onClick={() => setFlipped(!flipped)}>
      <div>
        <span className="muted">{flipped ? "Answer" : "Question"}</span>
        <h2>{flipped ? back : front}</h2>
      </div>
      <Button variant="secondary">{flipped ? "Show question" : "Reveal answer"}</Button>
    </div>
  );
}
