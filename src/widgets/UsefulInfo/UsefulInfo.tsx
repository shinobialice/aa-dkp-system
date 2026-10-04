import KrakenMap from "./KrakenMap";
import LeviathanMap from "./LeviathanMap";
import ZoomableImage from "./ZoomableImage";

const DRAGON_LAIR_MAP = "/images/maps/dragon-lair.png";

export default function UsefulInfo() {
  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Полезная информация
        </h1>
      </div>

      <section
        aria-label="Карта драконов"
        className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:p-4.5"
      >
        <div>
          <h2 className="text-base font-semibold">Карта драконов</h2>
        </div>
        <ZoomableImage
          src={DRAGON_LAIR_MAP}
          alt="Карта драконов"
          width={764}
          height={578}
        />
      </section>

      <LeviathanMap />

      <KrakenMap />
    </div>
  );
}
