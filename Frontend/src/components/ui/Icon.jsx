import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BookOpen,
  Brain,
  Check,
  CircleHelp,
  Clock3,
  ChartNoAxesCombined,
  CloudUpload,
  Dna,
  CirclePlay,
  FileText,
  Flame,
  Leaf,
  Lightbulb,
  ListTree,
  Mail,
  Microscope,
  Mic,
  MoveVertical,
  Network,
  PencilLine,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sun,
  Type,
  Volume2,
} from "lucide-react";

const icons = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  backpack: Backpack,
  book: BookOpen,
  brain: Brain,
  check: Check,
  help: CircleHelp,
  clock: Clock3,
  flame: Flame,
  chart: ChartNoAxesCombined,
  leaf: Leaf,
  lightbulb: Lightbulb,
  list: ListTree,
  microscope: Microscope,
  network: Network,
  pencil: PencilLine,
  shield: ShieldCheck,
  sparkle: Sparkles,
  spacing: MoveVertical,
  sun: Sun,
  volume: Volume2,
  cloudUpload: CloudUpload,
  dna: Dna,
  file: FileText,
  mic: Mic,
  play: CirclePlay,
  refresh: RotateCcw,
  scroll: ScrollText,
  type: Type,
};

/** A single source for the product's non-generated SVG icons. */
export default function Icon({ name, size = "1em", strokeWidth = 2, ...props }) {
  const IconComponent = icons[name];

  if (!IconComponent) return null;

  return (
    <IconComponent
      aria-hidden="true"
      focusable="false"
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
