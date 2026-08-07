import { cn } from "@/lib/utils";
import { statusLabel, type LeadStatus } from "@/lib/backoffice";

const TONES: Record<LeadStatus, string> = {
  nouveau: "bg-accent/15 text-accent-foreground border-accent/40",
  qualifie: "bg-primary/10 text-primary border-primary/30",
  transmis_fournisseur: "bg-primary/15 text-primary border-primary/40",
  proposition_envoyee: "bg-primary/20 text-primary border-primary/50",
  signe: "bg-primary text-primary-foreground border-primary",
  perdu: "bg-destructive/10 text-destructive border-destructive/30",
  doublon: "bg-mist text-slate border-slate/30",
  sans_suite: "bg-mist text-slate border-slate/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[status],
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
