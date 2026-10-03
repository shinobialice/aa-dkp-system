import AddLootDialog from "../GuildLoot/AddLootDialog";
import EditSaleDialog from "../GuildLoot/EditSaleDialog";
import ExpenseDialog from "../GuildLoot/ExpenseDialog";
import type { ItemType } from "../GuildLoot/LootTypes";
import type { PlayerOption } from "../GuildLoot/PlayerCombobox";
import TreasuryIncomeDialog from "../GuildLoot/TreasuryIncomeDialog";
import ConfirmDialog from "./ConfirmDialog";
import EditPriceDialog from "./EditPriceDialog";
import SellStockDialog from "./SellStockDialog";
import type { TreasuryActions } from "./useTreasuryActions";

type Props = {
  actions: TreasuryActions;
  itemTypes: ItemType[];
  users: PlayerOption[];
  onStockChanged: () => Promise<void>;
};

export default function TreasuryDialogs({
  actions,
  itemTypes,
  users,
  onStockChanged,
}: Props) {
  return (
    <>
      <AddLootDialog
        key={actions.addLoot.key}
        open={actions.addLoot.open}
        presetItemName={actions.addLoot.preset}
        itemTypes={itemTypes}
        onClose={actions.closeAddLoot}
        onAdd={actions.addLootItem}
      />
      <ExpenseDialog
        request={actions.expenseDialog}
        users={users}
        onClose={actions.closeExpense}
        onSave={actions.saveExpense}
      />
      <SellStockDialog
        target={actions.sellTarget}
        users={users}
        onClose={actions.closeSell}
        onDone={onStockChanged}
      />
      <EditSaleDialog
        record={actions.editSale}
        users={users}
        onClose={actions.closeEditSale}
        onSave={actions.saveSale}
      />
      <TreasuryIncomeDialog
        item={actions.editTreasury}
        onClose={actions.closeEditTreasury}
        onSave={actions.saveTreasuryIncome}
      />
      <EditPriceDialog
        group={actions.priceTarget}
        onClose={actions.closePrice}
        onSave={actions.savePrice}
      />
      <ConfirmDialog request={actions.confirm} onClose={actions.closeConfirm} />
    </>
  );
}
