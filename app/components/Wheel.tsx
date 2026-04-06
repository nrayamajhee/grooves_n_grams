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
      className={`mt-1 max-[30rem]:mt-0.5 border-2 border-black/20 border-r-white/10 shadow-[-5px_5px_5px_rgba(0,0,0,0.5)] w-8 h-24 max-[80rem]:w-6 max-[80rem]:h-16 max-[30rem]:w-[18px] max-[30rem]:h-12 flex justify-between flex-col text-[#ddd] grid grid-rows-2 rounded-xl max-[80rem]:rounded-[10px] max-[30rem]:rounded-lg volume-wheel ${className}`}
    >
      <button
        onMouseDown={() => onVolumeUp(true)}
        onMouseUp={() => onVolumeUp(false)}
        onMouseLeave={() => onVolumeUp(false)}
        className="w-full h-full bg-transparent border-none text-transparent cursor-pointer bg-gradient-to-b from-black/20 to-white/10 rounded-t-xl max-[80rem]:rounded-t-[10px] max-[30rem]:rounded-t-lg"
      />
      <button
        onMouseDown={() => onVolumeDown(true)}
        onMouseUp={() => onVolumeDown(false)}
        onMouseLeave={() => onVolumeDown(false)}
        className="w-full h-full bg-transparent border-none text-transparent cursor-pointer bg-gradient-to-b from-white/10 to-black/20 rounded-b-xl max-[80rem]:rounded-b-[10px] max-[30rem]:rounded-b-lg"
      />
    </div>
  );
}
