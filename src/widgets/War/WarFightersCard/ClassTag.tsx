import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";

type Props = {
  userClass: string | null;
};

export default function ClassTag({ userClass }: Props) {
  if (!userClass) return null;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 [&_svg]:size-3.5"
      style={{ color: classColors[userClass] }}
    >
      {classIcons[userClass]}
      <span className="text-foreground/70">{userClass}</span>
    </span>
  );
}
