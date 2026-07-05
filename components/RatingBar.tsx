type RatingBarProps = {
  star: number;
  count: number;
  total: number;
};

export default function RatingBar({ star, count, total }: RatingBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 w-4 text-right flex-shrink-0">{star}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#0022FF" aria-hidden="true">
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          stroke="#0022FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0022FF] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-neutral-400 w-6 text-right flex-shrink-0">{count}</span>
    </div>
  );
}
