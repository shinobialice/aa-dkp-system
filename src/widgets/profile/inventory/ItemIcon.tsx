import Image from "next/image";

type ItemIconProps = {
  itemName: string;
  itemIconUrl: string | null;
  quality?: string | null;
};

export default function ItemIcon({
  itemName,
  itemIconUrl,
  quality,
}: ItemIconProps) {
  const parsedQuality = quality ? parseInt(quality) : null;

  // Раньше грузилось напрямую с archeagecodex.com — тот блокирует хотлинк-
  // запросы с чужого домена, поэтому рамки молча не показывались. Держим
  // локально в /api/uploads/grade-icons (см. LootIconComponent.tsx).
  let gradeUrl = "/api/uploads/grade-icons/grade1.png";

  if (parsedQuality === 3) {
    gradeUrl = "/api/uploads/grade-icons/grade10.png";
  } else if (parsedQuality === 4) {
    gradeUrl = "/api/uploads/grade-icons/grade11.png";
  } else if (parsedQuality === 5) {
    gradeUrl = "/api/uploads/grade-icons/grade12.png";
  }

  return (
    <div
      style={{
        position: "relative",
        width: "40px",
        height: "40px",
      }}
    >
      {itemIconUrl && (
        <Image
          src={itemIconUrl}
          alt={itemName}
          width={40}
          height={40}
          style={{
            position: "relative",
            top: 0,
            left: 0,
          }}
        />
      )}

      <Image
        src={gradeUrl}
        alt="grade icon"
        width={40}
        height={40}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
