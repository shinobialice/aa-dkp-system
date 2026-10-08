const QUEUE_SIZE = 2;

export function wrapIndex(index: number, count: number) {
  return (index + count) % count;
}

export function upcomingIndices(activeIndex: number, count: number) {
  const size = Math.min(QUEUE_SIZE, count - 1);
  return Array.from({ length: size }, (_, offset) =>
    wrapIndex(activeIndex + offset + 1, count),
  );
}
