export default function CommentBadge({ comment }: { comment?: string | null }) {
  if (!comment) return null;
  return (
    <span className="shrink-0 rounded-full border px-1.5 text-2xs text-muted-foreground">
      {comment}
    </span>
  );
}
