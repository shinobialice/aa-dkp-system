import { bonusesForBosses } from "../eventFormModel";
import type { EventForm } from "../useEventForm";
import BonusPicker from "./BonusPicker";
import BossSelector from "./BossSelector";
import CategorySelector from "./CategorySelector";
import RaidDateField from "./RaidDateField";
import RaidLootList from "./RaidLootList";
import RaidValueSummary from "./RaidValueSummary";
import UnlinkedLootPicker from "./UnlinkedLootPicker";

type Props = {
  form: EventForm;
};

export default function RaidDetailsForm({ form }: Props) {
  const { draft, errors } = form;
  const visibleBonuses = form.bonuses
    ? bonusesForBosses(form.bonuses, draft.bosses)
    : [];
  const activeBonusLabels = visibleBonuses
    .filter((bonus) => form.activeBonusIds.includes(bonus.id))
    .map((bonus) => bonus.label);
  const raidLoot = draft.category !== "АГЛ" ? form.event?.loot : undefined;

  return (
    <div className="flex flex-col gap-4">
      <CategorySelector
        value={draft.category}
        hasError={errors.category}
        onChange={form.selectCategory}
      />
      <BossSelector
        category={draft.category}
        bosses={form.bosses}
        selectedBoss={form.selectedBoss}
        hasError={errors.selectedBoss}
        onSelect={form.selectBoss}
      />
      <BonusPicker
        bonuses={visibleBonuses}
        activeIds={form.activeBonusIds}
        onToggle={(id) => form.toggleFlag("bonusIds", id)}
      />
      <RaidDateField
        mode={form.mode}
        category={draft.category}
        selectedBoss={form.selectedBoss}
        value={draft.date}
        hasError={errors.selectedDate}
        onChange={form.changeDate}
      />
      {raidLoot && <RaidLootList loot={raidLoot} />}
      <UnlinkedLootPicker
        items={form.unlinkedLoot}
        checkedIds={draft.lootLinkIds}
        onToggle={(id) => form.toggleFlag("lootLinkIds", id)}
      />
      <RaidValueSummary
        category={draft.category}
        selectedBoss={form.selectedBoss}
        bossNames={draft.bosses.map((boss) => boss.boss_name)}
        bonusLabels={activeBonusLabels}
        dkp={form.dkp}
      />
    </div>
  );
}
