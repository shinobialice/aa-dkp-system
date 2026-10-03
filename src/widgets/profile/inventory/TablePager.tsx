import { Button } from "@/shared/ui";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export default function TablePager({ page, pageCount, onPageChange }: Props) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-1">
      <span className="text-xs text-muted-foreground">
        Страница {page + 1} из {pageCount}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={page >= pageCount - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Далее
        </Button>
      </div>
    </div>
  );
}
