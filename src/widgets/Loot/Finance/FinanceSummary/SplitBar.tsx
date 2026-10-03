type Props = {
  parts: { value: number; className: string }[];
};

export default function SplitBar({ parts }: Props) {
  const visible = parts.filter((part) => part.value > 0);
  if (visible.length === 0) {
    return <span className="block h-2.5 rounded bg-muted" />;
  }

  return (
    <span className="flex h-2.5 gap-0.75 overflow-hidden rounded">
      {visible.map((part) => (
        <span
          key={part.className}
          className={part.className}
          style={{ flexGrow: part.value }}
        />
      ))}
    </span>
  );
}
