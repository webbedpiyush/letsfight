import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RotatedTextProps {
  children: ReactNode;
  className?: string;
  tilt?: "left" | "right";
}

export default function RotatedText({
  children,
  className,
  tilt = "left",
}: RotatedTextProps) {
  const tiltTail = tilt === "left" ? "-rotate-1" : "rotate-1";

  return (
    <span className={`relative whitespace-nowrap`}>
      <span
        className={cn(
          "absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 mx-2 my-1 text-[hsl(var(--foreground))]",
          className,
          tiltTail
        )}
        aria-hidden="true"
      />
      <span className={cn("relative uppercase font-bold")}>{children}</span>
    </span>
  );
}
