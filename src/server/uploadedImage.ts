import "server-only";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const PHOTO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];
export const TRANSPARENT_TYPES = ["image/png", "image/webp", "image/gif"];

export function getUploadedImage(formData: FormData, allowedTypes: string[]) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Файл не передан");
  }
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      allowedTypes.includes("image/jpeg")
        ? "Допустимы только изображения PNG, JPEG, WEBP или GIF"
        : "Нужна картинка с прозрачностью: PNG, WEBP или GIF",
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Файл слишком большой (максимум 5 МБ)");
  }
  return file;
}
