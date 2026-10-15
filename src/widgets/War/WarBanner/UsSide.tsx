import Image from "next/image";

export default function UsSide() {
  return (
    <div className="arena-from-left flex min-w-0 items-center gap-4 md:gap-5">
      <div className="relative h-[72px] w-16 shrink-0 md:h-[104px] md:w-[92px]">
        <div className="arena-shield arena-rim absolute inset-0" />
        <div className="arena-shield absolute inset-[3px] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#1f7a4a,#08160f)]">
          <Image
            src="/images/logo.png"
            alt=""
            fill
            sizes="140px"
            className="translate-x-[6%] translate-y-[14%] scale-150 object-contain"
          />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-2xs tracking-[0.12em] text-white/60 uppercase">Мы</p>
        <p className="-skew-x-8 font-display text-[clamp(30px,5.4vw,60px)] leading-[0.95] uppercase [text-shadow:0_4px_0_rgb(0_0_0/0.3)]">
          No Fear
        </p>
      </div>
    </div>
  );
}
