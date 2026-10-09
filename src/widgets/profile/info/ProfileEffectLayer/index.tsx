import type { ProfileEffect } from "@/shared/config/profileStyle";
import { cn } from "@/shared/lib/tw-merge";
import DragonFlyby from "../DragonFlyby";
import ParticleShape from "./ParticleShape";
import { EFFECT_BACKDROPS } from "./particleStreamsData";
import { effectParticles } from "./profileEffectModel";

type Props = {
  effect: ProfileEffect;
};

export default function ProfileEffectLayer({ effect }: Props) {
  if (effect === "dragon") return <DragonFlyby />;

  const backdrop = EFFECT_BACKDROPS[effect];

  return (
    <div
      aria-hidden
      className="pfx-layer pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {backdrop && <span className={cn("pfx-backdrop", backdrop)} />}
      {effectParticles(effect).map((particle) => (
        <span
          key={particle.key}
          className={`pfx pfx-${particle.motion}`}
          style={particle.outerStyle}
        >
          <span
            className={`pfx-body pfx-body-${particle.body}`}
            style={particle.bodyStyle}
          >
            <ParticleShape particle={particle} />
          </span>
        </span>
      ))}
    </div>
  );
}
