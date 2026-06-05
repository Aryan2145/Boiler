/** Official roundel — geometric seal used across both portals. */
export function Emblem({
  className = "",
  title = "Boiler Inspection Authority emblem",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1" />
      {/* radiating marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 24 + Math.cos(a) * 17;
        const y1 = 24 + Math.sin(a) * 17;
        const x2 = 24 + Math.cos(a) * 20;
        const y2 = 24 + Math.sin(a) * 20;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        );
      })}
      {/* pressure vessel pictogram */}
      <rect
        x="17"
        y="15"
        width="14"
        height="18"
        rx="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line x1="24" y1="15" x2="24" y2="11" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="33" x2="20" y2="37" stroke="currentColor" strokeWidth="2" />
      <line x1="28" y1="33" x2="28" y2="37" stroke="currentColor" strokeWidth="2" />
      <line x1="17" y1="24" x2="31" y2="24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
