"use server";

import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import { v } from "@/shared/lib/valibot";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import {
  describeFrameUnlock,
  isProfileEffect,
  PROFILE_EFFECTS,
  type ProfileEffect,
} from "@/shared/config/profileStyle";
import {
  getAvatarFrameRows,
  getCurrentWarKills,
  isFrameUnlocked,
  ownerProgress,
  resolveAvatarFrameUrls,
  type FrameOwner,
} from "@/server/avatarFrames";
import { getUploadedImage, PHOTO_TYPES } from "@/server/uploadedImage";
import { publishChanges } from "@/server/liveChanges";
import { getProfileCovers } from "./profileCovers";
import { getSessionUserId } from "./getSessionUserId";

type StyleRow = FrameOwner & Pick<UserRow, "cover_url" | "profile_effect">;

export type ProfileStyle = {
  coverUrl: string | null;
  frameUrl: string | null;
  effect: ProfileEffect | null;
};

export type FrameOption = {
  id: number;
  name: string;
  imageUrl: string;
  unlockType: string;
  condition: string;
  isUnlocked: boolean;
};

const StyleSchema = v.object({
  coverUrl: v.nullable(v.string()),
  frameId: v.nullable(v.number()),
  effect: v.nullable(v.picklist(PROFILE_EFFECTS.map((effect) => effect.value))),
});

export type ProfileStyleDraft = v.InferOutput<typeof StyleSchema>;

export type ProfileStyleOptions = Awaited<
  ReturnType<typeof getMyProfileStyleOptions>
>;

export async function getProfileStyle(userId: number): Promise<ProfileStyle> {
  const user = await findStyleRow(userId);
  if (!user) return { coverUrl: null, frameUrl: null, effect: null };
  const frameUrls = await resolveAvatarFrameUrls([user]);
  return toProfileStyle(user, frameUrls.get(user.id) ?? null);
}

export async function getMyProfileStyleOptions() {
  const userId = await requireSessionUserId();
  const [user, covers, frames, kills] = await Promise.all([
    findStyleRow(userId),
    getProfileCovers(),
    getAvatarFrameRows(),
    getCurrentWarKills([userId]),
  ]);
  if (!user) throw new Error("Игрок не найден");
  const progress = ownerProgress(user, kills);

  const frameOptions: FrameOption[] = frames.map((frame) => ({
    id: frame.id,
    name: frame.name,
    imageUrl: frame.image_url,
    unlockType: frame.unlock_type,
    condition: describeFrameUnlock(
      frame.unlock_type,
      frame.unlock_value,
      frame.unlock_class,
    ),
    isUnlocked: isFrameUnlocked(frame, progress),
  }));
  const draft: ProfileStyleDraft = {
    coverUrl: user.cover_url,
    frameId: user.avatar_frame_id,
    effect: parseEffect(user.profile_effect),
  };

  return { covers, frames: frameOptions, draft };
}

export async function uploadMyProfileCover(formData: FormData) {
  const userId = await requireSessionUserId();
  const file = getUploadedImage(formData, PHOTO_TYPES);
  const url = await saveUploadedFile(
    "profile-style",
    `users/${userId}/cover`,
    file,
  );
  return `${url}?t=${Date.now()}`;
}

export async function updateMyProfileStyle(input: ProfileStyleDraft) {
  const userId = await requireSessionUserId();
  const draft = v.parse(StyleSchema, input);
  const options = await getMyProfileStyleOptions();

  const coverUrl = draft.coverUrl;
  if (coverUrl !== null && coverUrl !== options.draft.coverUrl) {
    const ownPrefix = `/api/uploads/profile-style/users/${userId}/`;
    const isOwn = coverUrl.startsWith(ownPrefix);
    const isCatalog = options.covers.some(
      (cover) => cover.image_url === coverUrl,
    );
    if (!isOwn && !isCatalog) throw new Error("Такой обложки нет");
  }
  if (draft.frameId !== null && draft.frameId !== options.draft.frameId) {
    const frame = options.frames.find((option) => option.id === draft.frameId);
    if (!frame?.isUnlocked) throw new Error("Эта рамка пока недоступна");
  }

  await sql`
    UPDATE "user"
    SET cover_url = ${draft.coverUrl},
        avatar_frame_id = ${draft.frameId},
        profile_effect = ${draft.effect}
    WHERE id = ${userId}
  `;
  await publishChanges("members");
  return getProfileStyle(userId);
}

async function requireSessionUserId() {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Не авторизован");
  return userId;
}

async function findStyleRow(userId: number) {
  const [user] = await sql<StyleRow[]>`
    SELECT
      id,
      joined_at,
      class,
      secondary_class,
      tertiary_class,
      cover_url,
      avatar_frame_id,
      profile_effect
    FROM "user"
    WHERE id = ${userId}
  `;
  return user;
}

function toProfileStyle(user: StyleRow, frameUrl: string | null): ProfileStyle {
  return {
    coverUrl: user.cover_url,
    frameUrl,
    effect: parseEffect(user.profile_effect),
  };
}

function parseEffect(value: string | null) {
  return value !== null && isProfileEffect(value) ? value : null;
}
