// components/DynamicIcon.tsx
import * as LucideIcons from "lucide-react";

export function DynamicIcon({ name, ...props }) {
  const Icon = LucideIcons[name];

  if (!Icon) return null;

  return <Icon {...props} />;
}
