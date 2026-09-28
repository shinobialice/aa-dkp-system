"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  InputField,
} from "@/shared/ui";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { DB_GetKillCountDto, KillCount } from "@/widgets/killcount/types";
import { v } from "@/shared/lib";

const schema = v.object({
  userName: v.pipe(v.string(), v.trim(), v.minLength(2)),
  startHonor: v.pipe(v.number(), v.minValue(0)),
  endHonor: v.pipe(v.number(), v.minValue(0)),
  startKills: v.pipe(v.number(), v.minValue(0)),
  endKills: v.pipe(v.number(), v.minValue(0)),
  playerClass: v.string(),
  comment: v.optional(v.string()),
});

type FormSchema = v.InferInput<typeof schema>;

interface KillCountEditModalProps {
  rowToEdit?: KillCount | DB_GetKillCountDto;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  resetEditValue: () => void;
  onSubmit: (value: KillCount) => void;
}

const DEFAULT_VALUES: FormSchema = {
  userName: "",
  startHonor: 0,
  endHonor: 0,
  startKills: 0,
  endKills: 0,
  playerClass: "",
  comment: "",
};

export const KillCountEditModal: FC<KillCountEditModalProps> = ({
  rowToEdit,
  isVisible,
  setIsVisible,
  resetEditValue,
  onSubmit,
}) => {
  const form = useForm<FormSchema>({
    resolver: valibotResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isVisible && rowToEdit) {
      form.reset({ ...DEFAULT_VALUES, ...rowToEdit });
    }
    if (isVisible && !rowToEdit) {
      form.reset(DEFAULT_VALUES);
    }
  }, [isVisible, rowToEdit]);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.setFocus("userName");
    }
  }, [form.formState.isSubmitSuccessful, form.setFocus]);

  const handleSubmit = async (values: FormSchema) => {
    onSubmit({
      ...rowToEdit,
      ...values,
      id: (rowToEdit as KillCount)?.id ?? crypto.randomUUID(),
    });

    if (!rowToEdit) {
      form.reset();

      return;
    }

    resetEditValue();
    setIsVisible(false);
  };

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          resetEditValue();
        }
        setIsVisible(isOpen);
      }}
    >
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Добавление игрока:</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              id="add-player-form"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <InputField
                    name="userName"
                    label="Никнейм"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    autoComplete="off"
                    name="playerClass"
                    label="Класс игрока"
                    inputVariant="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    autoComplete="off"
                    name="startHonor"
                    label="Хонора в начале"
                    inputVariant="integer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    autoComplete="off"
                    name="endHonor"
                    label="Хонора в конце"
                    inputVariant="integer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    autoComplete="off"
                    name="startKills"
                    label="Килов в начале"
                    inputVariant="integer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    autoComplete="off"
                    name="endKills"
                    label="Килов в конце"
                    inputVariant="integer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    autoComplete="off"
                    name="comment"
                    label="Комментарий"
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button form="add-player-form" type="submit">
            {rowToEdit ? "Изменить" : "Добавить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
