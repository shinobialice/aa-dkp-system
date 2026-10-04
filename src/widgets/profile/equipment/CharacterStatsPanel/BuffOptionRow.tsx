import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import type {
  CharacterBuff,
  CharacterBuffOption,
} from "../itemsData/buffTypes";
import {
  BUFF_OFF,
  buffIconUrl,
  findBuff,
  findOption,
  hasOptionIcons,
} from "../characterBuffs";
import BuffTooltipCard from "./BuffTooltipCard";

type Props = {
  buff: CharacterBuff;
  value: string;
  available: boolean;
  onChange: (value: string) => void;
};

export default function BuffOptionRow({
  buff,
  value,
  available,
  onChange,
}: Props) {
  const requiredName =
    buff.requiresBuffId === undefined
      ? undefined
      : findBuff(buff.requiresBuffId)?.name;
  const selectedOption = findOption(buff, value);
  const showOptionIcons = hasOptionIcons(buff);

  return (
    <div className="flex items-center gap-3">
      <Image
        src={buffIconUrl(buff, selectedOption)}
        alt=""
        width={28}
        height={28}
        className="size-7 shrink-0 rounded"
      />
      <div className="min-w-0 flex-1 text-sm">
        <div className="truncate">{buff.name}</div>
        {!available && requiredName && (
          <div className="text-xs text-muted-foreground">
            Нужно «{requiredName}»
          </div>
        )}
      </div>
      <Select value={value} onValueChange={onChange} disabled={!available}>
        <SelectTrigger className="w-44 shrink-0 cursor-pointer">
          <SelectValue>{selectedOption?.label ?? "Выключен"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={BUFF_OFF}>Выключен</SelectItem>
          {buff.options.map((option) => (
            <BuffOptionItem
              key={option.value}
              buff={buff}
              option={option}
              showIcon={showOptionIcons}
            />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function BuffOptionItem({
  buff,
  option,
  showIcon,
}: {
  buff: CharacterBuff;
  option: CharacterBuffOption;
  showIcon: boolean;
}) {
  const icon = buffIconUrl(buff, option);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SelectItem value={option.value} className="cursor-pointer">
          {showIcon && (
            <Image
              src={icon}
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0 rounded"
            />
          )}
          {option.label}
        </SelectItem>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="dark w-72 border-border bg-background p-3 text-foreground"
      >
        <BuffTooltipCard
          icon={icon}
          title={`${buff.name}: ${option.label}`}
          description={option.text}
        />
      </TooltipContent>
    </Tooltip>
  );
}
