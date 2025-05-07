import { Suspense } from "react";
import AuthErrorContent from "@/src/components/errorpage/AuthErrorContent";

export default function AuthErrorPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 text-center">
      <Suspense fallback={<p>Загрузка...</p>}>
        <AuthErrorContent />
      </Suspense>
      <div className="mb-6">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/48AieXPNnZc?autoplay=1&mute=1"
          title="Access Denied"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-lg mt-6"
        />
      </div>
    </div>
  );
}
