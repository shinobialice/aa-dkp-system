import type { EventSettings } from "@/actions/eventSettings";

const BANNER_CLASS =
  "block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md";

type Props = {
  event: EventSettings;
};

export default function EventBanner({ event }: Props) {
  if (!isActive(event)) return null;

  const content = <EventBannerContent event={event} />;
  if (!event.link) return <div className={BANNER_CLASS}>{content}</div>;

  return (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      className={BANNER_CLASS}
    >
      {content}
    </a>
  );
}

function EventBannerContent({ event }: Props) {
  if (!event.imageUrl) {
    return <p className="px-5 py-4 text-lg font-semibold">{event.title}</p>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded banner of arbitrary size, next/image would need fixed dimensions
    <img
      src={event.imageUrl}
      alt={event.title ?? ""}
      className="block h-16 w-full object-cover object-left sm:h-auto"
    />
  );
}

function isActive(event: EventSettings) {
  if (!event.title || !event.startsAt || !event.endsAt) return false;
  const now = Date.now();
  return (
    new Date(event.startsAt).getTime() <= now &&
    new Date(event.endsAt).getTime() > now
  );
}
