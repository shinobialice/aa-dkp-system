"use client";

import { useRef, useState } from "react";
import { Ghost } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/shared/ui";

const DimonishMenuItem = () => {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const handleClose = () => {
    setOpen(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="cursor-pointer" onClick={handleOpen}>
        <Ghost className="h-5 w-5" />
        <span>Димониш</span>
      </SidebarMenuButton>

      <audio ref={audioRef} src="/audio/dimonish.mp3" onEnded={handleClose} />

      {open && (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/70"
          onClick={handleClose}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dimonish-ava.png"
            alt="Димониш"
            className="max-h-[80vh] max-w-[80vw] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default DimonishMenuItem;
