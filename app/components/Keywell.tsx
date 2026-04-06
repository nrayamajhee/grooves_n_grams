import type { ReactNode } from "react";

type KeywellProps = {
  children: ReactNode;
  className?: string;
};

export function Keywell({ children, className = "" }: KeywellProps) {
  return (
    <div className={`flex gap-3 max-[80rem]:gap-[10px] max-[30rem]:gap-2 items-start bg-[#0e0e0e] border-t-2 border-t-black/20 border-b-2 border-b-white/5 shadow-[inset_0_5px_10px_black] p-3 pt-1 max-[80rem]:p-[10px] max-[80rem]:pt-[3px] max-[30rem]:p-2 max-[30rem]:pt-[2px] rounded-t-[8px_8px] rounded-b-[12px_12px] max-[80rem]:rounded-t-[6px_6px] max-[80rem]:rounded-b-[10px_10px] max-[30rem]:rounded-t-[4px_4px] max-[30rem]:rounded-b-[8px_8px] ${className}`}>
      {children}
    </div>
  );
}
