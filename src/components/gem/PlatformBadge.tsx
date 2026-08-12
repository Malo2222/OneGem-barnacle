import { platformMeta } from "@/lib/gem";
import { cn } from "@/lib/utils";

export function PlatformBadge({
  platform,
  className,
  size = "sm",
}: {
  platform: string;
  className?: string;
  size?: "xs" | "sm";
}) {
  const meta = platformMeta(platform);
  return (
    <span
      title={meta.label}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-tight",
        size === "xs" ? "h-4 min-w-4 px-1 text-[9px]" : "h-5 min-w-5 px-1.5 text-[10px]",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${meta.color} 22%, transparent)`,
        color: meta.color,
        border: `1px solid color-mix(in oklab, ${meta.color} 40%, transparent)`,
      }}
    >
      {meta.short}
    </span>
  );
}