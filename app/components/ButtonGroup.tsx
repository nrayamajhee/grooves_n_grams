import type { ReactNode } from "react";

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
};

export function ButtonGroup({ children, className = "" }: ButtonGroupProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {children}
    </div>
  );
}
