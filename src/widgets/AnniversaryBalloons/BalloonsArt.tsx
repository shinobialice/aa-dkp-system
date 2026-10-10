import { cn } from "@/shared/lib/tw-merge";

const balloons = [
  {
    cx: 17,
    cy: 9,
    rx: 11,
    ry: 14,
    color: "#d764a8",
    string: "M17 26 q-3 6 0 12 t0 12",
    duration: "3.4s",
    delay: "0s",
  },
  {
    cx: 49,
    cy: 11,
    rx: 10,
    ry: 13,
    color: "#e89d35",
    string: "M49 27 q-3 5 0 10 t0 10",
    duration: "3.8s",
    delay: "-0.6s",
  },
  {
    cx: 33,
    cy: 5,
    rx: 12,
    ry: 15,
    color: "#2f9e62",
    string: "M33 23 q3 7 0 14 t0 14",
    duration: "3s",
    delay: "-1.2s",
  },
];

export default function BalloonsArt({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 54"
      aria-hidden
      className={cn("pointer-events-none text-muted-foreground", className)}
    >
      {balloons.map((b) => {
        const bottom = b.cy + b.ry;
        const shineX = b.cx - b.rx * 0.45;
        const shineY = b.cy + b.ry * 0.2;
        return (
          <g
            key={b.color}
            className="anniversary-balloon"
            style={{ animationDuration: b.duration, animationDelay: b.delay }}
          >
            <path
              d={b.string}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.8}
              strokeLinecap="round"
            />
            <path
              d={`M${b.cx - 2.5} ${bottom + 3} L${b.cx + 2.5} ${bottom + 3} L${b.cx} ${bottom - 0.5} Z`}
              fill={b.color}
            />
            <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} />
            <ellipse
              cx={shineX}
              cy={shineY}
              rx={b.rx * 0.2}
              ry={b.ry * 0.3}
              fill="white"
              opacity={0.35}
              transform={`rotate(25 ${shineX} ${shineY})`}
            />
          </g>
        );
      })}
    </svg>
  );
}
