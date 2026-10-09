import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import type { FrameOption } from "@/actions/profileStyle";
import { avatarSrc } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarFrame, AvatarImage } from "@/shared/ui";
import { frameGroups } from "./framePickerModel";

type Props = {
  frames: FrameOption[];
  value: number | null;
  username: string;
  avatarUrl: string | null;
  onChange: (frameId: number | null) => void;
};

export default function FramePicker({
  frames,
  value,
  username,
  avatarUrl,
  onChange,
}: Props) {
  const avatar = (
    <Avatar className="size-12">
      <AvatarImage src={avatarSrc(username, avatarUrl)} alt="" />
      <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FrameTile
          name="Без рамки"
          condition="Обычный аватар"
          isSelected={value === null}
          isUnlocked
          onSelect={() => onChange(null)}
        >
          {avatar}
        </FrameTile>
      </div>
      {frameGroups(frames, value).map((group) => (
        <section key={group.title} className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group.title}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {group.frames.map((frame) => (
              <FrameTile
                key={frame.id}
                name={frame.name}
                condition={group.showsCondition ? frame.condition : null}
                isSelected={value === frame.id}
                isUnlocked={frame.isUnlocked}
                onSelect={() => onChange(frame.id)}
              >
                <AvatarFrame frameUrl={frame.imageUrl}>{avatar}</AvatarFrame>
              </FrameTile>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FrameTile({
  name,
  condition,
  isSelected,
  isUnlocked,
  onSelect,
  children,
}: {
  name: string;
  condition: string | null;
  isSelected: boolean;
  isUnlocked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={!isUnlocked}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-lg border px-2 pt-4 pb-3 text-center disabled:cursor-default",
        isSelected && "border-primary ring-2 ring-primary/40",
      )}
    >
      <span className={cn(!isUnlocked && "opacity-40 grayscale")}>
        {children}
      </span>
      <span className="text-sm font-semibold">{name}</span>
      {condition && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {!isUnlocked && <Lock className="size-3 shrink-0" />}
          {condition}
        </span>
      )}
    </button>
  );
}
