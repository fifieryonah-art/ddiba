import { NavLink } from "react-router-dom";
import { BookOpen, CirclePlay, FileText, ChartNoAxesCombined } from "lucide-react";

const links = [
  ["/dashboard", BookOpen, "Learn"],
  ["/practice", CirclePlay, "Practice"],
  ["/upload", FileText, "Notes"],
  ["/progress", ChartNoAxesCombined, "Progress"]
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map(([to, Icon, label]) => (
        <NavLink key={to} to={to} className={({isActive}) => isActive ? "active" : ""}>
          <span><Icon aria-hidden="true" size="1em" /></span>
          <small>{label}</small>
        </NavLink>
      ))}
    </nav>
  );
}
