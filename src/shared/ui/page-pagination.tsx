"use client";

import type { MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const MAX_PLAIN_PAGES = 7;

type PageItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: string };

type PagePaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function PagePagination({
  page,
  pageCount,
  onPageChange,
  className,
}: PagePaginationProps) {
  const goTo = (target: number) => (event: MouseEvent) => {
    event.preventDefault();
    onPageChange(Math.min(pageCount, Math.max(1, target)));
  };
  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={goTo(page - 1)}
            aria-disabled={isFirst}
            className={isFirst ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pageItems(page, pageCount).map((item) => (
          <PaginationItem key={item.type === "page" ? item.page : item.key}>
            {item.type === "ellipsis" && <PaginationEllipsis />}
            {item.type === "page" && (
              <PaginationLink
                href="#"
                isActive={item.page === page}
                onClick={goTo(item.page)}
              >
                {item.page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={goTo(page + 1)}
            aria-disabled={isLast}
            className={isLast ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function pageItems(current: number, total: number): PageItem[] {
  if (total <= MAX_PLAIN_PAGES) {
    return Array.from({ length: total }, (_, index) => ({
      type: "page",
      page: index + 1,
    }));
  }
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  const items: PageItem[] = [{ type: "page", page: 1 }];
  if (from > 2) items.push({ type: "ellipsis", key: "start" });
  for (let page = from; page <= to; page += 1) {
    items.push({ type: "page", page });
  }
  if (to < total - 1) items.push({ type: "ellipsis", key: "end" });
  items.push({ type: "page", page: total });
  return items;
}

export { PagePagination };
