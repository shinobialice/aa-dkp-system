import Image from "next/image";

type ItemIconProps = {
  itemName: string;
  itemIconUrl: string | null;
  quality?: string | null;
};

// Рамка по качеству (T1/T2/эпоха) для большинства предметов — общая, по
// quality. "Коллекционный пет" — исключение: T1 использует другую рамку,
// чем остальные T1-предметы (icon_grade4, не общий icon_grade10).
const gradeUrlOverrides: Record<string, Record<string, string>> = {
  "Коллекционный пет": {
    "3": "https://archeagecodex.com/images/icon_grade4.png",
    "4": "https://archeagecodex.com/images/icon_grade11.png",
  },
};

export default function ItemIcon({
  itemName,
  itemIconUrl,
  quality,
}: ItemIconProps) {
  const parsedQuality = quality ? parseInt(quality) : null;

  let gradeUrl = "https://archeagecodex.com/images/icon_grade1.png";

  if (parsedQuality === 3) {
    gradeUrl = "https://archeagecodex.com/images/icon_grade10.png";
  } else if (parsedQuality === 4) {
    gradeUrl = "https://archeagecodex.com/images/icon_grade11.png";
  } else if (parsedQuality === 5) {
    gradeUrl = "https://archeagecodex.com/images/icon_grade12.png";
  }

  const override = quality ? gradeUrlOverrides[itemName]?.[quality] : undefined;
  if (override) gradeUrl = override;

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
