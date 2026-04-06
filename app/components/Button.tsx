import type { ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  isPressed?: boolean;
  variant?: "default" | "track";
  className?: string;
};

export function Button({ onClick, children, isPressed = false, variant = "default", className = "" }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center bg-[#171717] pt-8 px-2 pb-2 max-[30rem]:pt-[18px] max-[30rem]:px-1 max-[30rem]:pb-1 max-[30rem]:border border-t-0 border-r border-r-white/10 border-b border-b-black/50 border-l border-l-black/50 rounded-b-xl text-[#ddd] cursor-pointer transition-transform duration-100 ease-out origin-top shadow-[-5px_5px_10px_rgba(0,0,0,0.5)] hover:text-white hover:bg-[#222]";
  
  const pressedClasses = isPressed 
    ? "bg-[#123f12] border-[#215d21] border-t-transparent [transform:perspective(100px)_rotateX(-3deg)] transition-duration-200" 
    : "";
  
  const trackClasses = variant === "track"
    ? "min-w-[40px] max-[80rem]:min-w-[32px] max-[30rem]:min-w-[24px] text-2xl max-[80rem]:text-base max-[30rem]:text-xs active:[transform:perspective(100px)_rotateX(-20deg)]" 
    : "";
  
  const iconClasses = variant === "default"
    ? "text-2xl max-[80rem]:text-base max-[30rem]:text-xs leading-none"
    : "leading-none";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${pressedClasses} ${trackClasses} ${className}`}
    >
      <span className={iconClasses}>
        {children}
      </span>
    </button>
  );
}
