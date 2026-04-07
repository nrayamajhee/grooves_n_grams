import type { ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  isPressed?: boolean;
  pressedColor?: "green" | "purple";
  variant?: "default" | "track";
  className?: string;
};

export function Button({ onClick, children, isPressed = false, pressedColor = "green", variant = "default", className = "" }: ButtonProps) {
  const bgClass = isPressed
    ? pressedColor === "purple" ? "key-pressed-purple" : "key-pressed-green"
    : "key-default";

  const baseClasses = "inline-flex items-center justify-center pt-6 px-[3px] pb-[6px] border-t-0 border-b-0 border-l border-l-black/20 rounded-b-[10px] text-[#ddd] cursor-pointer transition-transform duration-100 ease-out origin-top shadow-[-5px_5px_10px_rgba(0,0,0,0.5)] active:[transform:perspective(100px)_rotateX(-20deg)]";

  const pressedTransform = isPressed ? "[transform:perspective(100px)_rotateX(-10deg)]" : "";

  const trackClasses = variant === "track"
    ? "text-base" 
    : "";
  
  const iconClasses = variant === "default"
    ? "text-base leading-none"
    : "leading-none";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${bgClass} ${pressedTransform} ${trackClasses} ${className}`}
    >
      <span className={iconClasses}>
        {children}
      </span>
    </button>
  );
}
