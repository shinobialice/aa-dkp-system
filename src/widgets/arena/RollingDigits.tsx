import { cn } from "@/shared/lib/tw-merge";

type Props = {
  text: string;
  className?: string;
};

export default function RollingDigits({ text, className }: Props) {
  return (
    <span
      className={cn("inline-flex items-baseline", className)}
      aria-label={text}
    >
      {[...text].map((char, index) => (
        <DigitCell key={index} char={char} />
      ))}
    </span>
  );
}

function DigitCell({ char }: { char: string }) {
  if (!/\d/.test(char)) {
    return (
      <span aria-hidden className="px-px opacity-45">
        {char}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="inline-block h-[1.12em] w-[0.66em] overflow-hidden text-center"
    >
      <span key={char} className="arena-roll block">
        {char}
      </span>
    </span>
  );
}
