import type { ReactNode } from "react";

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
};

export function ButtonGroup({ children, className = "" }: ButtonGroupProps) {
  return (
    <div className={`flex gap-2 max-[30rem]:gap-1 ${className}`}>
      {children}
    </div>
  );
}
