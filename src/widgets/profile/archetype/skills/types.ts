export type SkillKind = "active" | "passive";

export type EferundVariant = {
  id: string;
  name: string;
  iconUrl: string;
  meta: string[];
  // HTML — рендерится через dangerouslySetInnerHTML, теги ограничены span/br
  // из исходных данных (см. skillTooltipHtml в SkillIconButton).
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  kind: SkillKind;
  iconUrl: string;
  meta: string[];
  description: string;
  // Мин. число других взятых навыков этой ветки, необходимое чтобы открыть
  // этот навык (см. saveUserSkillBuild.ts). У большинства навыков — 0.
  unlockThreshold?: number;
  // Альтернативные формы уже взятого навыка (не стоят очков, переключаются
  // свободно). Сам базовый навык в этот список не входит.
  eferund?: EferundVariant[];
};
