import type { ReactNode } from "react";

type KeywellProps = {
  children: ReactNode;
  className?: string;
};

export function Keywell({ children, className = "" }: KeywellProps) {
  return (
    <div className={`flex gap-3 items-start bg-[#181818] border-b-2 border-b-white/20 shadow-[inset_0_5px_10px_#070707] p-3 pt-1 rounded-t-[4px] rounded-b-[12px] ${className}`}>
      {children}
    </div>
  );
}
