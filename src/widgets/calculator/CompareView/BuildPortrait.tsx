import Image from "next/image";

type Props = {
  name: string;
  portraitUrl: string;
};

export default function BuildPortrait({ name, portraitUrl }: Props) {
  return (
    <div className="relative h-56 w-40 shrink-0 self-center overflow-hidden rounded-lg border bg-muted/40 sm:h-auto sm:self-stretch">
      <Image
        src={portraitUrl}
        alt={name}
        fill
        unoptimized
        className="object-cover object-center"
      />
    </div>
  );
}
