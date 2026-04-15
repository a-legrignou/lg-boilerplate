import { Crown, Users } from "lucide-react";
import BadgeIcon from "@/components/widgets/badge-icon";

const TIER_CONFIG = {
  premium:   { label: "Premium",   icon: Crown, variant: "gold" },
  community: { label: "Community", icon: Users, variant: "sage" },
};

export default function TierBadge({ tier, className }) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;
  return <BadgeIcon label={config.label} icon={config.icon} variant={config.variant} className={className} />;
}
