import { format, parse } from "date-fns";
import { DateTimePicker, Input } from "@/shared/ui";
import { parseVkNameInput } from "../roleClasses";
import Field from "./Field";
import type { Draft } from "./profileDraft";

type Props = {
  draft: Draft;
  onChange: (patch: Partial<Draft>) => void;
  usernameError: boolean;
  canEditNickname: boolean;
  canEditVk: boolean;
  canEditJoinedAt: boolean;
};

const DATE_FORMAT = "yyyy-MM-dd";

export default function BasicFields({
  draft,
  onChange,
  usernameError,
  canEditNickname,
  canEditVk,
  canEditJoinedAt,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Ник"
        required
        locked={!canEditNickname}
        error={usernameError ? "Укажи ник" : null}
      >
        <Input
          value={draft.username}
          disabled={!canEditNickname}
          aria-invalid={usernameError}
          onChange={(event) => onChange({ username: event.target.value })}
        />
      </Field>
      <Field label="VK" locked={!canEditVk}>
        <Input
          value={draft.vkName}
          disabled={!canEditVk}
          placeholder="Ссылка или короткое имя"
          onChange={(event) =>
            onChange({ vkName: parseVkNameInput(event.target.value) })
          }
        />
      </Field>
      <Field
        label="Дата вступления"
        locked={!canEditJoinedAt}
        hint={canEditJoinedAt ? undefined : "Меняют только администраторы"}
      >
        <DateTimePicker
          classNames={{ trigger: "w-full" }}
          hideTime
          disabled={!canEditJoinedAt}
          value={
            draft.joinedAt
              ? parse(draft.joinedAt, DATE_FORMAT, new Date())
              : undefined
          }
          onChange={(date) =>
            onChange({ joinedAt: date ? format(date, DATE_FORMAT) : "" })
          }
        />
      </Field>
    </div>
  );
}
