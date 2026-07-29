import { Link } from "@tanstack/react-router";
import { IconTile } from "@/components/ui/icon-tile";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  items: NavItem[];
  onNavigate?: () => void;
  title: string;
  className?: string;
}

export function MegaMenu({ items, onNavigate, title, className }: MegaMenuProps) {
  return (
    <div
      className={cn(
        "absolute left-1/2 top-full -translate-x-1/2 w-[min(920px,calc(100vw-32px))] bg-background rounded-b-3xl shadow-medium border-t border-border p-6",
        className,
      )}
      role="menu"
      aria-label={title}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            role="menuitem"
            className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <IconTile icon={item.icon} className="h-12 w-12 md:h-12 md:w-12 shrink-0" />
            <div className="min-w-0">
              <div className="text-label text-ink">{item.label}</div>
              <p className="text-small text-slate mt-1">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}