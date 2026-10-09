"use client";
import { useRef, useState, type FormEvent } from "react";
import { ImageUp } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatarFrame } from "@/actions/avatarFrames";
import {
  FRAME_UNLOCK_TYPES,
  isFrameUnlockType,
  type FrameUnlockType,
} from "@/shared/config/profileStyle";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import UnlockValueField from "./UnlockValueField";
import {
  conditionFields,
  INITIAL_CONDITION,
  type FrameCondition,
} from "./frameConditionModel";

type Props = {
  onAdded: () => void;
};

const ACCEPTED_TYPES = "image/png,image/webp,image/gif";

export default function AddFrameForm({ onAdded }: Props) {
  const [name, setName] = useState("");
  const [unlockType, setUnlockType] = useState<FrameUnlockType>("rank");
  const [condition, setCondition] = useState(INITIAL_CONDITION);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUnlockTypeChange = (value: string) => {
    if (isFrameUnlockType(value)) setUnlockType(value);
  };

  const handleConditionChange = (patch: Partial<FrameCondition>) => {
    setCondition((current) => ({ ...current, ...patch }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error("Выберите картинку рамки");
      return;
    }
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("name", name);
      payload.append("unlockType", unlockType);
      const fields = conditionFields(unlockType, condition);
      payload.append("unlockValue", fields.unlockValue);
      payload.append("unlockClass", fields.unlockClass);
      await uploadAvatarFrame(payload);
      toast.success("Рамка добавлена");
      setName("");
      setFile(null);
      onAdded();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось добавить рамку"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 px-4 py-3"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="frame-name">Название</Label>
        <Input
          id="frame-name"
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
          placeholder="Легенда"
          className="w-44"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Кому доступна</Label>
        <Select value={unlockType} onValueChange={handleUnlockTypeChange}>
          <SelectTrigger
            className="w-52 cursor-pointer"
            aria-label="Кому доступна"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FRAME_UNLOCK_TYPES.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="cursor-pointer"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <UnlockValueField
        unlockType={unlockType}
        condition={condition}
        onChange={handleConditionChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="max-w-56 cursor-pointer"
      >
        <ImageUp />
        <span className="truncate">{file ? file.name : "Картинка PNG"}</span>
      </Button>
      <Button type="submit" disabled={isSaving} className="cursor-pointer">
        {isSaving ? "Добавляю…" : "Добавить рамку"}
      </Button>
    </form>
  );
}
