import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

export default function AppHeader({ title = "Ddiba", backTo }) {
  return (
    <header className="app-header">
      <div className="header-left">
        {backTo ? <Link to={backTo} className="header-icon" aria-label="Go back"><Icon name="arrowLeft" /></Link> : <div className="brand-mark">D</div>}
        <div>
          <strong>{title}</strong>
        </div>
      </div>
      <div className="avatar">S</div>
    </header>
  );
}
