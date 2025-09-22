"use client";

import { useState } from "react";
import { Button } from "@/shared/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { addUserSalaryBonus } from "@/actions/addUserSalaryBonus";

export default function AddSalaryBonusDialog({
  open,
  onClose,
  userId,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  userId: number;
  onAdded: () => void;
}) {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      await addUserSalaryBonus({ userId, amount, reason });
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить бонус</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="pb-2">Процент</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="pb-2">Комментарий</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button onClick={handleSubmit}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
