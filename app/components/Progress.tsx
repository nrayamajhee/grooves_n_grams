type ProgressProps = {
  value: number;
  max?: number;
};

export function Progress({ value, max = 100 }: ProgressProps) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full h-2 max-[30rem]:h-1.5 rounded-full bg-black/50 overflow-hidden border border-white/5 border-t-black/50">
      <div
        className="h-full rounded-full bg-white/20 transition-[width] duration-300 ease-linear"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
