"use client";

import { useRef, useState } from "react";
import { Ghost } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/shared/ui";

function useDimonish() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const show = () => {
    setOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const hide = () => {
    setOpen(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const overlay = (
    <>
      <audio ref={audioRef} src="/audio/dimonish.mp3" onEnded={hide} />
      {open && (
        <div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/70"
          onClick={hide}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dimonish-ava.png"
            alt="Димониш"
            className="max-h-[80vh] max-w-[80vw] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );

  return { show, overlay };
}

function DimonishMenuItem() {
  const { show, overlay } = useDimonish();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="cursor-pointer"
        tooltip="Димониш"
        onClick={show}
      >
        <Ghost />
        <span>Димониш</span>
      </SidebarMenuButton>
      {overlay}
    </SidebarMenuItem>
  );
}

export function DimonishTile({ className }: { className: string }) {
  const { show, overlay } = useDimonish();

  return (
    <>
      <button type="button" className={className} onClick={show}>
        <Ghost className="size-5.5 text-muted-foreground" />
        Димониш
      </button>
      {overlay}
    </>
  );
}

export default DimonishMenuItem;
