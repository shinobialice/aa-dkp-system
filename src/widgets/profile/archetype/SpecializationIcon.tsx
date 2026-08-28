import Image from "next/image";
import { getSpecialization } from "./specializationsData";

export function SpecializationIcon({
  id,
  size = 20,
}: {
  id: string;
  size?: number;
}) {
  const spec = getSpecialization(id);
  if (!spec) return null;

  return (
    <Image
      src={spec.iconUrl}
      alt={spec.name}
      width={size}
      height={size}
      unoptimized
      style={{ imageRendering: "pixelated", width: size, height: "auto" }}
    />
  );
}
