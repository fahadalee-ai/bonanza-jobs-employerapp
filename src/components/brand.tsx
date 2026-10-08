import logoColor from "@/img/logo.png";
import logoWhite from "@/img/logo-white.png";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "color",
  className,
  height = 56,
}: {
  variant?: "color" | "white";
  className?: string;
  height?: number;
}) {
  return (
    <img
      src={variant === "white" ? logoWhite : logoColor}
      alt="Bonanza Jobs"
      height={height}
      className={cn("w-auto max-w-full object-contain", className)}
      style={{ height }}
    />
  );
}
