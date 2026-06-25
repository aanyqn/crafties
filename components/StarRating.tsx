type StarRatingProps = {
  rating: number; // e.g. 4.5
  max?: number;
  size?: number; // px
  showValue?: boolean;
  className?: string;
};

export default function StarRating({
  rating,
  max = 5,
  size = 14,
  showValue = false,
  className = "",
}: StarRatingProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const full = i + 1 <= Math.floor(rating);
        const half = !full && i < rating && i + 1 > rating;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={full ? "#0022FF" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#0022FF" />
                    <stop offset="50%" stopColor="#E5E5E5" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  fill={`url(#half-${i})`}
                  stroke="#0022FF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={full ? "#0022FF" : "#E5E5E5"}
                stroke={full ? "#0022FF" : "#D4D4D4"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        );
      })}
      {showValue && (
        <span className="text-xs font-semibold text-neutral-700 ml-0.5">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
