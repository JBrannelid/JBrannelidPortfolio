import { LucideIcon } from "lucide-react";

export interface NavigationProps {
  onAboutClick: () => void;
  onCVClick: () => void;
  onContactClick: () => void;
  onGitHubClick: () => void;
  onLinkedInClick: () => void;
}

export interface NavButton {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  type: "internal" | "external";
  color: string;
}
