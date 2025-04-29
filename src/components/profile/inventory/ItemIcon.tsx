interface ItemIconProps {
  itemName: string;
  itemIconUrl: string | null;
  quality?: string | null;
}

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

  return (
    <div
      style={{
        position: "relative",
        width: "40px",
        height: "40px",
      }}
    >
      {itemIconUrl && (
        <img
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

      {/* Grade Overlay */}
      <img
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
