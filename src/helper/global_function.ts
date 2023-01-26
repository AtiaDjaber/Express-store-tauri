export function resolveImage(image: string): string {
  return image == null
    ? require("@/assets/no-image.png")
    : process.env.VUE_APP_API_URL + "storage/attachments/" + image;
}
