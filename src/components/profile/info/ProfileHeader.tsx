"use client";
import { Pencil, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import editUser from "@/src/actions/editUser";

const badgeColors: { [key: string]: string } = {
  Активен: "rgb(47, 158, 98)",
  "Получает зарплату": "rgb(23, 133, 115)",
  Администратор: "rgb(215, 100, 168)",
  Сноровка: "rgb(90, 54, 165)",
  Крит: "rgb(215, 100, 168)",
  ДВ: "rgb(232, 157, 53)",
  Двурук: "rgb(0, 148, 168)",
  Каст: "rgb(157, 41, 41)",
  Деф: "rgb(40, 111, 180)",
  Модератор: "rgb(58, 76, 92)",
};

export default function ProfileHeader({
  user,
  formData,
  setFormData,
  editMode,
  setEditMode,
  tags,
  isAdmin,
}: {
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  tags: { id: number; tag: string }[];
  isAdmin: boolean;
}) {
  return (
    <CardHeader className="flex flex-col items-center">
      <div className="relative flex justify-center w-full">
        <div className="absolute right-0 top-0 flex gap-2">
          {editMode && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-green-500 cursor-pointer"
              onClick={() => {
                editUser(
                  user.id,
                  formData.username,
                  formData.class,
                  Number(formData.classGearScore),
                  formData.secondaryClass ?? null,
                  formData.secondaryClassGearScore != null
                    ? Number(formData.secondaryClassGearScore)
                    : null,
                  formData.vkName,
                  formData.joined_at
                );
                setEditMode(false);
              }}
            >
              <Check />
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground cursor-pointer"
              onClick={() => setEditMode(!editMode)}
            >
              <Pencil />
            </Button>
          )}
        </div>

        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
            alt={user.username}
          />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>

      <CardTitle className="text-2xl">
        {(() => {
          if (editMode) {
            return (
              <Input
                className="text-center text-2xl font-bold"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            );
          }
          return formData.username;
        })()}
      </CardTitle>

      <div className="flex gap-2 mt-2">
        {user.active && (
          <Badge
            className="text-background"
            style={{ backgroundColor: badgeColors["Активен"] }}
          >
            Активен
          </Badge>
        )}
        {user.is_eligible_for_salary && (
          <Badge
            className="text-background"
            style={{ backgroundColor: badgeColors["Получает зарплату"] }}
          >
            Получает зарплату
          </Badge>
        )}
        {tags?.map((tag) => (
          <Badge
            key={tag.id}
            className="text-background"
            style={{
              backgroundColor: badgeColors[tag.tag] || "rgb(59, 130, 246)",
            }}
          >
            {tag.tag}
          </Badge>
        ))}
      </div>
    </CardHeader>
  );
}
