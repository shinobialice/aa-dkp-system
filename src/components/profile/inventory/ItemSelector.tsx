import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ItemSelectorProps = {
  item: any;
  userItem: any;
  onChange: (value: string) => void;
  isAdmin: boolean;
}

export default function ItemSelector({
  item,
  userItem,
  onChange,
  isAdmin,
}: ItemSelectorProps) {
  const isBafalka = item.name === "Бафалка";

  const isSpecialItem = [
    "Коллеционный глайдер",
    "Коллеционный глайдер т2",
    "Коллекционный фамильяр",
    "Коллекционный фамильяр т2",
  ].includes(item.name);

  const isDragon = item.name === "Дракон";
  const getDisplayValue = () => {
    if (isBafalka) {
      return !userItem
        ? "Нету"
        : userItem.quality === "3"
        ? "3 эпоха"
        : userItem.quality === "4"
        ? "4 эпоха"
        : userItem.quality === "5"
        ? "5 эпоха"
        : "Нету";
    }

    if (isDragon) {
      return userItem?.name || "Нету";
    }

    if (isSpecialItem) {
      return !userItem
        ? "Нету"
        : userItem.quality === "3"
        ? "T1"
        : userItem.quality === "4"
        ? "T2"
        : "Нету";
    }

    return userItem ? "Есть" : "Нет";
  };

  if (!isAdmin) {
    return (
      <div className="w-[100px] text-sm py-2 px-3 border rounded bg-muted text-muted-foreground">
        {getDisplayValue()}
      </div>
    );
  }

  if (isBafalka) {
    return (
      <Select
        value={
          !userItem
            ? "Нету"
            : userItem.quality === "3"
            ? "3 эпоха"
            : userItem.quality === "4"
            ? "4 эпоха"
            : userItem.quality === "5"
            ? "5 эпоха"
            : "Нету"
        }
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[100px] cursor-pointer">
          <SelectValue placeholder="Выбрать" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Нету">Нету</SelectItem>
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
        value={!userItem ? "Нету" : userItem.name}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[100px] cursor-pointer">
          <SelectValue placeholder="Выбрать" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Нету">Нету</SelectItem>
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
            ? "Нету"
            : userItem.quality === "3"
            ? "T1"
            : userItem.quality === "4"
            ? "T2"
            : "Нету"
        }
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[100px] cursor-pointer">
          <SelectValue placeholder="Выбрать" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Нету">Нету</SelectItem>
          <SelectItem value="T1">T1</SelectItem>
          <SelectItem value="T2">T2</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={userItem ? "Есть" : "Нет"} onValueChange={onChange}>
      <SelectTrigger className="w-[100px] cursor-pointer">
        <SelectValue placeholder="Выбрать" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Есть">Есть</SelectItem>
        <SelectItem value="Нет">Нет</SelectItem>
      </SelectContent>
    </Select>
  );
}
