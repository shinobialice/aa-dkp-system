"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  updateMyProfileStyle,
  type ProfileStyle,
  type ProfileStyleDraft,
  type ProfileStyleOptions,
} from "@/actions/profileStyle";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button, DialogFooter, Segmented } from "@/shared/ui";
import StylePreview from "./StylePreview";
import CoverPicker from "./CoverPicker";
import FramePicker from "./FramePicker";
import EffectPicker from "./EffectPicker";

type Props = {
  options: ProfileStyleOptions;
  username: string;
  avatarUrl: string | null;
  onSaved: (style: ProfileStyle) => void;
  onCancel: () => void;
};

type Tab = "cover" | "frame" | "effect";

const TABS: { value: Tab; label: string }[] = [
  { value: "cover", label: "Обложка" },
  { value: "frame", label: "Рамка" },
  { value: "effect", label: "Эффект" },
];

export default function ProfileStyleForm({
  options,
  username,
  avatarUrl,
  onSaved,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState(options.draft);
  const [tab, setTab] = useState<Tab>("cover");
  const [isSaving, setIsSaving] = useState(false);
  const frameUrl =
    options.frames.find(
      (frame) => frame.id === draft.frameId && frame.isUnlocked,
    )?.imageUrl ?? null;

  const handleChange = (patch: Partial<ProfileStyleDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSaved(await updateMyProfileStyle(draft));
      toast.success("Оформление сохранено");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить оформление"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <StylePreview
        username={username}
        avatarUrl={avatarUrl}
        coverUrl={draft.coverUrl}
        frameUrl={frameUrl}
        effect={draft.effect}
      />
      <Segmented
        value={tab}
        options={TABS}
        onChange={setTab}
        label="Что настроить"
      />
      <TabPanel
        tab={tab}
        options={options}
        draft={draft}
        username={username}
        avatarUrl={avatarUrl}
        onChange={handleChange}
      />
      <DialogFooter>
        <Button variant="outline" className="cursor-pointer" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          className="cursor-pointer"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? "Сохраняю…" : "Сохранить"}
        </Button>
      </DialogFooter>
    </div>
  );
}

function TabPanel({
  tab,
  options,
  draft,
  username,
  avatarUrl,
  onChange,
}: {
  tab: Tab;
  options: ProfileStyleOptions;
  draft: ProfileStyleDraft;
  username: string;
  avatarUrl: string | null;
  onChange: (patch: Partial<ProfileStyleDraft>) => void;
}) {
  if (tab === "cover") {
    return (
      <CoverPicker
        covers={options.covers}
        value={draft.coverUrl}
        onChange={(coverUrl) => onChange({ coverUrl })}
      />
    );
  }
  if (tab === "frame") {
    return (
      <FramePicker
        frames={options.frames}
        value={draft.frameId}
        username={username}
        avatarUrl={avatarUrl}
        onChange={(frameId) => onChange({ frameId })}
      />
    );
  }
  return (
    <EffectPicker
      value={draft.effect}
      onChange={(effect) => onChange({ effect })}
    />
  );
}
