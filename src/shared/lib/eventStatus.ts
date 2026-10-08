type EventPeriod = {
  title: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

export function isEventActive(event: EventPeriod, now = Date.now()) {
  if (!event.title || !event.startsAt || !event.endsAt) return false;
  return Date.parse(event.startsAt) <= now && Date.parse(event.endsAt) > now;
}
