"use client";

import clsx from "clsx";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type Direction = "up" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: 0 | 100 | 200 | 300 | 400 | 500 | 600;
  direction?: Direction;
  once?: boolean;
  className?: string;
  /** For passing custom properties a breakpoint-scoped utility reads back. */
  style?: CSSProperties;
};

const directionHiddenClasses: Record<Direction, string> = {
  up: "opacity-0 translate-y-6",
  left: "opacity-0 -translate-x-6",
  right: "opacity-0 translate-x-6",
};

// Literal Tailwind class names so the JIT scanner picks them all up regardless
// of which one is selected at runtime.
const delayClasses: Record<NonNullable<RevealProps["delay"]>, string> = {
  0: "delay-0",
  100: "delay-100",
  200: "delay-200",
  300: "delay-300",
  400: "delay-[400ms]",
  500: "delay-500",
  600: "delay-[600ms]",
};

export default function Reveal({
  children,
  as: Component = "div",
  delay = 0,
  direction = "up",
  once = true,
  className,
  style,
}: RevealProps) {
  const [ref, isVisible] = useInView<HTMLElement>({ once });

  return (
    <Component
      ref={ref}
      style={style}
      className={clsx(
        "transition-all duration-700 ease-out",
        delayClasses[delay],
        isVisible ? "translate-x-0 translate-y-0 opacity-100" : directionHiddenClasses[direction],
        className
      )}
    >
      {children}
    </Component>
  );
}
