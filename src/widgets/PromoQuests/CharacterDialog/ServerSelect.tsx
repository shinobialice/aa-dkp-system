import { GAME_SERVERS } from "@/shared/config/gameServers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type Props = {
  id: string;
  value: string;
  onChange: (server: string) => void;
};

export default function ServerSelect({ id, value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full cursor-pointer">
        <SelectValue placeholder="Выберите сервер" />
      </SelectTrigger>
      <SelectContent>
        {GAME_SERVERS.map((server) => (
          <SelectItem key={server} className="cursor-pointer" value={server}>
            {server}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
