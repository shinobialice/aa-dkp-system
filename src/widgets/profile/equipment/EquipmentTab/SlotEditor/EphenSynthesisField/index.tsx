import type { EphenSynthesisCategory } from "../../../itemsData/ephenSynthesisData";
import { getSealGradeLabel } from "@/widgets/profile/seals/sealsData";
import type { FieldProps } from "../fieldProps";
import OptionCheckList from "./OptionCheckList";
import StatSelect from "./StatSelect";
import type { OptionContext } from "./formatOption";

type PoolProps = FieldProps & {
  category: EphenSynthesisCategory;
  context: OptionContext;
};

export default function EphenSynthesisField(props: FieldProps) {
  const { draft, options, onChange } = props;
  const category = options.ephenCategory;
  if (!category) return null;

  return (
    <div className="space-y-1.5">
      <div className="text-xs text-muted-foreground">Эффект синтеза:</div>
      {!options.ephenEligible && (
        <div className="text-xs text-muted-foreground">
          Доступен начиная с качества «{getSealGradeLabel(category.minGrade)}» —
          выберите качество выше.
        </div>
      )}
      {options.ephenEligible && (
        <div className="space-y-2">
          <PercentSlider
            value={draft.ephenSynthesisPercent}
            onChange={(ephenSynthesisPercent) =>
              onChange({ ephenSynthesisPercent })
            }
          />
          <EphenPools
            {...props}
            category={category}
            context={{ grade: draft.grade, minGrade: category.minGrade }}
          />
        </div>
      )}
    </div>
  );
}

function EphenPools(props: PoolProps) {
  if (props.category.groups.length === 2) return <TwoPoolPicker {...props} />;
  return <StatPicker {...props} />;
}

function TwoPoolPicker({ draft, onChange, category, context }: PoolProps) {
  const [firstPool, secondPool] = category.groups;
  const tertiary = draft.ephenSynthesisTertiary;
  const secondary = draft.ephenSynthesisSecondary;

  return (
    <>
      <div className="text-xs text-muted-foreground">
        Первый пул (выбрано {tertiary.length}/{firstPool.pickCount})
      </div>
      <OptionCheckList
        options={firstPool.options}
        selected={tertiary}
        limit={firstPool.pickCount}
        context={context}
        onToggle={(key) =>
          onChange({ ephenSynthesisTertiary: toggleKey(tertiary, key) })
        }
      />
      <div className="text-xs text-muted-foreground">
        Второй пул (выбрано {secondary ? 1 : 0}/1)
      </div>
      <OptionCheckList
        options={secondPool.options}
        selected={secondary ? [secondary] : []}
        limit={Infinity}
        context={context}
        onToggle={(key) =>
          onChange({ ephenSynthesisSecondary: secondary === key ? "" : key })
        }
      />
    </>
  );
}

function StatPicker({ draft, onChange, category, context }: PoolProps) {
  const [primaryGroup, secondaryGroup, tertiaryGroup] = category.groups;
  const tertiary = draft.ephenSynthesisTertiary;

  return (
    <>
      <StatSelect
        options={primaryGroup.options}
        value={draft.ephenSynthesisPrimary}
        excluded={draft.ephenSynthesisSecondary}
        placeholder="Первая характеристика"
        context={context}
        onChange={(ephenSynthesisPrimary) =>
          onChange({ ephenSynthesisPrimary })
        }
      />
      {secondaryGroup && (
        <StatSelect
          options={secondaryGroup.options}
          value={draft.ephenSynthesisSecondary}
          excluded={draft.ephenSynthesisPrimary}
          placeholder="Вторая характеристика"
          context={context}
          onChange={(ephenSynthesisSecondary) =>
            onChange({ ephenSynthesisSecondary })
          }
        />
      )}
      {tertiaryGroup && (
        <OptionCheckList
          options={tertiaryGroup.options}
          selected={tertiary}
          limit={tertiaryGroup.pickCount}
          context={context}
          onToggle={(key) =>
            onChange({ ephenSynthesisTertiary: toggleKey(tertiary, key) })
          }
        />
      )}
    </>
  );
}

function PercentSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Опыт синтеза</span>
        <span>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  );
}

function toggleKey(keys: string[], key: string) {
  return keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key];
}
