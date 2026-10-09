"use server";

import { randomUUID } from "crypto";
import sql from "@/shared/lib/db";
import type { ProfileCoverRow } from "@/shared/lib/dbTypes";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import { getUploadedImage, PHOTO_TYPES } from "@/server/uploadedImage";
import ensurePrivilieges from "./ensurePrivilieges";

export async function getProfileCovers() {
  return sql<ProfileCoverRow[]>`
    SELECT id, image_url FROM profile_cover ORDER BY id
  `;
}

export async function uploadProfileCover(formData: FormData) {
  await ensurePrivilieges(["Администратор"]);
  const file = getUploadedImage(formData, PHOTO_TYPES);

  const imageUrl = await saveUploadedFile(
    "profile-style",
    `covers/${randomUUID()}`,
    file,
  );
  await sql`INSERT INTO profile_cover (image_url) VALUES (${imageUrl})`;
}

export async function deleteProfileCover(id: number) {
  await ensurePrivilieges(["Администратор"]);
  await sql`DELETE FROM profile_cover WHERE id = ${id}`;
}
