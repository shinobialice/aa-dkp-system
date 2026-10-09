import * as React from "react";

import { cn } from "@/shared/lib/tw-merge";

function AvatarFrame({
  frameUrl,
  className,
  children,
}: {
  frameUrl: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      data-slot="avatar-frame"
      className={cn("relative inline-flex shrink-0", className)}
    >
      {children}
      {frameUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frameUrl}
          alt=""
          draggable={false}
          className="pointer-events-none absolute top-1/2 left-1/2 size-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
        />
      )}
    </span>
  );
}

export { AvatarFrame };
