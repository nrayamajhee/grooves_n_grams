type WheelProps = {
  onVolumeUp: (isMouseDown: boolean) => void;
  onVolumeDown: (isMouseDown: boolean) => void;
  ref?: React.RefObject<HTMLDivElement | null>;
  className?: string;
};

export function Wheel({ onVolumeUp, onVolumeDown, ref, className = "" }: WheelProps) {
  return (
    <div
      ref={ref}
      className={`mt-1 border-2 border-black/20 border-r-white/10 shadow-[-5px_5px_5px_rgba(0,0,0,0.5)] w-[40px] h-24 flex justify-between flex-col text-[#ddd] grid grid-rows-2 rounded-xl volume-wheel ${className}`}
    >
      <button
        onMouseDown={() => onVolumeUp(true)}
        onMouseUp={() => onVolumeUp(false)}
        onMouseLeave={() => onVolumeUp(false)}
        className="w-full h-full bg-transparent border-none text-transparent cursor-pointer bg-gradient-to-b from-black/20 to-white/10 rounded-t-xl"
      />
      <button
        onMouseDown={() => onVolumeDown(true)}
        onMouseUp={() => onVolumeDown(false)}
        onMouseLeave={() => onVolumeDown(false)}
        className="w-full h-full bg-transparent border-none text-transparent cursor-pointer bg-gradient-to-b from-white/10 to-black/20 rounded-b-xl"
      />
    </div>
  );
}
