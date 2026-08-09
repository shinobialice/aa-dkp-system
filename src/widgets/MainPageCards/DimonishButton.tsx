"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";

const FALLBACK_HIDE_MS = 6000;

const DimonishButton = () => {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => clearHideTimeout, []);

  const handleOpen = () => {
    setOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(handleClose, FALLBACK_HIDE_MS);
  };

  const handleClose = () => {
    setOpen(false);
    clearHideTimeout();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className={cn(
          "fixed top-6 right-6 z-40 cursor-pointer shadow-lg transition-opacity duration-300",
          open && "pointer-events-none opacity-0",
        )}
      >
        Димониш
      </Button>

      <audio ref={audioRef} src="/audio/dimonish.mp3" onEnded={handleClose} />

      <div
        className={cn(
          "fixed top-0 right-6 z-40 w-40 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          open ? "translate-y-0" : "translate-y-[-140%]",
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Спрятать Димониша"
          className={cn(
            "block w-full cursor-pointer",
            open && "dimonish-wobble",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dimonish-ava.png"
            alt="Димониш"
            className="aspect-square w-full rounded-b-2xl object-cover shadow-2xl"
          />
        </button>
      </div>
    </>
  );
};

export default DimonishButton;
