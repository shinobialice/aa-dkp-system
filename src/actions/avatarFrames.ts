"use server";

import { randomUUID } from "crypto";
import sql from "@/shared/lib/db";
import { v } from "@/shared/lib/valibot";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import { FRAME_UNLOCK_TYPES } from "@/shared/config/profileStyle";
import { CLASS_ORDER } from "@/shared/config/classes";
import { getAvatarFrameRows } from "@/server/avatarFrames";
import { getUploadedImage, TRANSPARENT_TYPES } from "@/server/uploadedImage";
import { publishChanges } from "@/server/liveChanges";
import ensurePrivilieges from "./ensurePrivilieges";

const FrameSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Укажите название рамки"),
    v.maxLength(40),
  ),
  unlockType: v.picklist(FRAME_UNLOCK_TYPES.map((type) => type.value)),
  unlockValue: v.pipe(
    v.string(),
    v.transform(Number),
    v.integer("Условие должно быть целым числом"),
    v.minValue(0),
  ),
  unlockClass: v.string(),
});

export async function getAvatarFramesForAdmin() {
  await ensurePrivilieges(["Администратор"]);
  return getAvatarFrameRows();
}

export async function uploadAvatarFrame(formData: FormData) {
  await ensurePrivilieges(["Администратор"]);
  const frame = v.parse(FrameSchema, {
    name: formData.get("name"),
    unlockType: formData.get("unlockType"),
    unlockValue: formData.get("unlockValue"),
    unlockClass: formData.get("unlockClass"),
  });
  const unlockClass = frame.unlockType === "class" ? frame.unlockClass : null;
  if (unlockClass !== null && !CLASS_ORDER.includes(unlockClass)) {
    throw new Error("Выберите класс");
  }
  const file = getUploadedImage(formData, TRANSPARENT_TYPES);

  const imageUrl = await saveUploadedFile(
    "profile-style",
    `frames/${randomUUID()}`,
    file,
  );
  await sql`
    INSERT INTO avatar_frame (name, image_url, unlock_type, unlock_value, unlock_class)
    VALUES (${frame.name}, ${imageUrl}, ${frame.unlockType}, ${frame.unlockValue}, ${unlockClass})
  `;
}

export async function deleteAvatarFrame(id: number) {
  await ensurePrivilieges(["Администратор"]);
  await sql`DELETE FROM avatar_frame WHERE id = ${id}`;
  await publishChanges("members");
}
