import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

type ItemSelectorProps = {
  item: any;
  userItem: any;
  onChange: (value: string) => void;
  canEdit: boolean;
};

const triggerClass =
  "h-6 w-auto min-w-0 gap-1 rounded-full border-none bg-secondary px-2.5 text-[11px] font-medium shadow-none hover:bg-secondary/80 cursor-pointer data-[size=sm]:h-6";

export default function ItemSelector({
  item,
  userItem,
  onChange,
  canEdit,
}: ItemSelectorProps) {
  const isBafalka = item.name === "Бафалка";

  const isSpecialItem = [
    "Коллеционный глайдер",
    "Коллеционный глайдер т2",
    "Коллекционный фамильяр",
    "Коллекционный фамильяр т2",
    "Коллекционный пет",
    "Коллекционный пет т2",
  ].includes(item.name);

  const isDragon = item.name === "Дракон";
  const getDisplayValue = () => {
    if (isBafalka) {
      return !userItem
        ? "Нет"
        : userItem.quality === "3"
          ? "3 эпоха"
          : userItem.quality === "4"
            ? "4 эпоха"
            : userItem.quality === "5"
              ? "5 эпоха"
              : "Нет";
    }

    if (isDragon) {
      return userItem?.name || "Нет";
    }

    if (isSpecialItem) {
      return !userItem
        ? "Нет"
        : userItem.quality === "3"
          ? "T1"
          : userItem.quality === "4"
            ? "T2"
            : "Нет";
    }

    return userItem ? "Есть" : "Нет";
  };

  if (!canEdit) {
    const isPresent = getDisplayValue() !== "Нет";
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
          isPresent
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground"
        }`}
      >
        {getDisplayValue()}
      </span>
    );
  }

  if (isBafalka) {
    return (
      <Select
        value={
          !userItem
            ? "Нет"
            : userItem.quality === "3"
              ? "3 эпоха"
              : userItem.quality === "4"
                ? "4 эпоха"
                : userItem.quality === "5"
                  ? "5 эпоха"
                  : "Нет"
        }
        onValueChange={onChange}
      >
        <SelectTrigger size="sm" className={triggerClass}>
          <SelectValue placeholder="Выбрать" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Нет">Нет</SelectItem>
          <SelectItem value="3 эпоха">3 эпоха</SelectItem>
          <SelectItem value="4 эпоха">4 эпоха</SelectItem>
          <SelectItem value="5 эпоха">5 эпоха</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (isDragon) {
    return (
      <Select
        value={!userItem ? "Нет" : userItem.name}
        onValueChange={onChange}
      >
        <SelectTrigger size="sm" className={triggerClass}>
          <SelectValue placeholder="Выбрать" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Нет">Нет</SelectItem>
          <SelectItem value="Красный Дракон">Красный Дракон</SelectItem>
          <SelectItem value="Черный Дракон">Черный Дракон</SelectItem>
          <SelectItem value="Зеленый Дракон">Зеленый Дракон</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (isSpecialItem) {
    return (
      <Select
        value={
          !userItem
            ? "Нет"
            : userItem.quality === "3"
              ? "T1"
              : userItem.quality === "4"
                ? "T2"
                : "Нет"
        }
        onValueChange={onChange}
      >
        <SelectTrigger size="sm" className={triggerClass}>
          <SelectValue placeholder="Выбрать" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Нет">Нет</SelectItem>
          <SelectItem value="T1">T1</SelectItem>
          <SelectItem value="T2">T2</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={userItem ? "Есть" : "Нет"} onValueChange={onChange}>
      <SelectTrigger size="sm" className={triggerClass}>
        <SelectValue placeholder="Выбрать" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Есть">Есть</SelectItem>
        <SelectItem value="Нет">Нет</SelectItem>
      </SelectContent>
    </Select>
  );
}
