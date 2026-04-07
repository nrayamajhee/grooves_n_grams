type ProgressProps = {
  value: number;
  max?: number;
};

export function Progress({ value, max = 100 }: ProgressProps) {
  return (
    <progress
      className="progress-bar w-full h-2 rounded-md"
      max={max}
      value={value}
    />
  );
}
