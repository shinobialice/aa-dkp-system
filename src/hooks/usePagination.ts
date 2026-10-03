"use client";

import { useState } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(0);
  const [pagedItems, setPagedItems] = useState(items);

  if (items !== pagedItems) {
    setPagedItems(items);
    setPage(0);
  }

  return {
    page,
    setPage,
    pageCount: Math.ceil(items.length / pageSize),
    pageItems: items.slice(page * pageSize, (page + 1) * pageSize),
  };
}
