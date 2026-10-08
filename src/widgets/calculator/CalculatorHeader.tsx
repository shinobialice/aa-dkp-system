import { ArrowLeftRight, Link2 } from "lucide-react";
import type { CalculatorShare } from "@/actions/calculatorShare";
import { formatMoscowDateTime } from "@/shared/lib/format";
import { Button } from "@/shared/ui";

type Props = {
  share: CalculatorShare | null;
  isComparing: boolean;
  onSwap: () => void;
  onShare: () => void;
};

export default function CalculatorHeader({
  share,
  isComparing,
  onSwap,
  onShare,
}: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Калькулятор сборок
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Соберите куклу с нуля или возьмите свою или чужую экипировку. Меняйте
          предметы, сравнивайте и сохраняйте куклы под своими названиями —
          профили при этом не меняются.
        </p>
        {share && (
          <p className="flex items-center gap-1.5 text-sm">
            <Link2 className="size-4 shrink-0 text-green-600" />
            Сборка по ссылке от <b>{share.authorName}</b> ·{" "}
            {formatMoscowDateTime(share.createdAt)}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {isComparing && (
          <Button variant="outline" className="cursor-pointer" onClick={onSwap}>
            <ArrowLeftRight />
            Поменять A и B
          </Button>
        )}
        <Button className="cursor-pointer" onClick={onShare}>
          <Link2 />
          Поделиться ссылкой
        </Button>
      </div>
    </header>
  );
}
