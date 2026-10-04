import { classColors } from "@/widgets/MembersTable/classStyles";

type Props = {
  userClass: string;
};

export default function ClassBadge({ userClass }: Props) {
  const color = classColors[userClass];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 font-semibold"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color ?? "#71717a"} 12%, transparent)`,
      }}
    >
      {userClass}
    </span>
  );
}
