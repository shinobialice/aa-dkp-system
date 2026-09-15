"use server";
import sql from "@/shared/lib/db";
import { hasTag } from "./hasTag";
import { getSessionUserId } from "./getSessionUserId";
import { cookies } from "next/headers";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export type MarketplaceCurrency = "gold" | "rub";
export type MarketplaceListingType = "buy" | "sell";

export type MarketplaceListing = {
  id: number;
  user_id: number;
  listing_type: MarketplaceListingType;
  catalog_item_id: number | null;
  item_name: string;
  quantity: number;
  price: number | null;
  currency: MarketplaceCurrency;
  description: string | null;
  image_url: string | null;
  created_at: string;
  seller_username: string;
  seller_avatar_url: string | null;
  seller_vk_id: string | null;
  seller_vk_name: string | null;
  catalog_icon_url: string | null;
  catalog_grade: number | null;
};

type ListingInput = {
  listingType: MarketplaceListingType;
  catalogItemId: number | null;
  itemName: string;
  quantity: number;
  price: number | null;
  currency: MarketplaceCurrency;
  description: string | null;
  imageUrl: string | null;
};

function validateListingInput({
  listingType,
  itemName,
  quantity,
  price,
  currency,
}: ListingInput) {
  const trimmedName = itemName.trim();
  if (!trimmedName) {
    throw new Error("Укажите название предмета");
  }
  if (listingType !== "buy" && listingType !== "sell") {
    throw new Error("Некорректный тип объявления");
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    throw new Error("Количество должно быть не меньше 1");
  }
  if (price !== null && (!Number.isFinite(price) || price < 0)) {
    throw new Error("Некорректная цена");
  }
  if (currency !== "gold" && currency !== "rub") {
    throw new Error("Некорректная валюта");
  }
  return trimmedName;
}

async function ensureCanEditListing(id: number, userId: number) {
  const [listing] = await sql<{ user_id: number }[]>`
    SELECT user_id FROM marketplace_listings WHERE id = ${id}
  `;
  if (!listing) {
    throw new Error("Объявление не найдено");
  }
  if (listing.user_id !== userId) {
    throw new Error("Access denied: insufficient privileges");
  }
}

// Доска объявлений: участники сами продают/покупают друг у друга предметы
// (кастомные или из отдельного каталога marketplace_item_type — см.
// marketplaceItemTypeAdmin.ts, не путать с item_type казны/лута), никак не
// затрагивая казну/финансы — отдельная таблица marketplace_listings без
// связи с loot/finance.
export async function getMarketplaceListings(): Promise<MarketplaceListing[]> {
  return await sql<MarketplaceListing[]>`
    SELECT
      ml.id, ml.user_id, ml.listing_type, ml.catalog_item_id, ml.item_name, ml.quantity,
      ml.price, ml.currency, ml.description, ml.image_url, ml.created_at,
      u.username AS seller_username, u.avatar_url AS seller_avatar_url,
      u.vk_id AS seller_vk_id, u.vk_name AS seller_vk_name,
      mit.icon_url AS catalog_icon_url, mit.grade AS catalog_grade
    FROM marketplace_listings ml
    JOIN "user" u ON u.id = ml.user_id
    LEFT JOIN marketplace_item_type mit ON mit.id = ml.catalog_item_id
    ORDER BY ml.created_at DESC
  `;
}

// Фото своего предмета для объявлений "свой предмет" — когда его нет в
// каталоге item_type и взять иконку неоткуда. Доступно любому авторизованному
// участнику (в отличие от uploadItemTypeIcon, который только для админов).
export async function uploadMarketplaceListingImage(
  formData: FormData,
): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Необходимо авторизоваться");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Файл не передан");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Допустимы только изображения PNG, JPEG, WEBP или GIF");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Файл слишком большой (максимум 5 МБ)");
  }

  try {
    return await saveUploadedFile("marketplace-images", randomUUID(), file);
  } catch (error) {
    console.error("Failed to upload marketplace listing image:", error);
    throw new Error("Не удалось загрузить фото");
  }
}

export async function createMarketplaceListing(input: ListingInput) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Необходимо авторизоваться");
  }

  const trimmedName = validateListingInput(input);
  const { listingType, catalogItemId, quantity, price, currency, description, imageUrl } = input;

  try {
    await sql`
      INSERT INTO marketplace_listings (user_id, listing_type, catalog_item_id, item_name, quantity, price, currency, description, image_url)
      VALUES (${userId}, ${listingType}, ${catalogItemId}, ${trimmedName}, ${quantity}, ${price}, ${currency}, ${description?.trim() || null}, ${imageUrl})
    `;
  } catch (error) {
    console.error("Ошибка при создании объявления:", error);
    throw new Error("Не удалось создать объявление");
  }
}

export async function updateMarketplaceListing(id: number, input: ListingInput) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Необходимо авторизоваться");
  }

  await ensureCanEditListing(id, userId);
  const trimmedName = validateListingInput(input);
  const { listingType, catalogItemId, quantity, price, currency, description, imageUrl } = input;

  try {
    await sql`
      UPDATE marketplace_listings SET
        listing_type = ${listingType},
        catalog_item_id = ${catalogItemId},
        item_name = ${trimmedName},
        quantity = ${quantity},
        price = ${price},
        currency = ${currency},
        description = ${description?.trim() || null},
        image_url = ${imageUrl}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Ошибка при изменении объявления:", error);
    throw new Error("Не удалось изменить объявление");
  }
}

export async function deleteMarketplaceListing(id: number) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Необходимо авторизоваться");
  }

  const [listing] = await sql<{ user_id: number }[]>`
    SELECT user_id FROM marketplace_listings WHERE id = ${id}
  `;
  if (!listing) {
    throw new Error("Объявление не найдено");
  }

  if (listing.user_id !== userId) {
    const sessionToken = (await cookies()).get("session_token")?.value ?? "";
    const isAdmin = await hasTag(sessionToken, ["Администратор"]);
    if (!isAdmin) {
      throw new Error("Access denied: insufficient privileges");
    }
  }

  await sql`DELETE FROM marketplace_listings WHERE id = ${id}`;
}
