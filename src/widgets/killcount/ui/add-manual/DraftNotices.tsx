import { Info, TriangleAlert } from "lucide-react";
import { KILLCOUNT_ROLES } from "@/shared/config/killcountRoles";
import { Alert, AlertDescription, AlertTitle, Button } from "@/shared/ui";
import type { KillCountExclusion } from "../../types";

// Что сайт убрал из списка сканера, и ники, с которыми сохранение не пройдёт.
export function DraftNotices({
  excluded,
  unknownNames,
  onRemoveUnknown,
}: {
  excluded: KillCountExclusion[];
  unknownNames: string[];
  onRemoveUnknown: () => void;
}) {
  return (
    <>
      {excluded.length > 0 && (
        <Alert>
          <Info />
          <AlertTitle>Не попали в киллкаунт: {excluded.length}</AlertTitle>
          <AlertDescription>
            <p>
              {excluded
                .map((item) => `${item.userName} — ${item.reason}`)
                .join("; ")}
            </p>
            <p>
              Из сканера берутся только пользователи сайта на ролях{" "}
              {KILLCOUNT_ROLES.join(", ")}. Роль определяется по трём веткам
              класса из профиля, иначе берётся основная. Кого-то вернуть можно
              кнопкой «Добавить» в таблице.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {unknownNames.length > 0 && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            Этих ников нет на сайте: {unknownNames.length}
          </AlertTitle>
          <AlertDescription>
            <p>{unknownNames.join(", ")}</p>
            <p>
              Сохранение не пройдёт, пока они в списке. Уберите их или исправьте
              ник в строке.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={onRemoveUnknown}
            >
              Убрать из списка
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
