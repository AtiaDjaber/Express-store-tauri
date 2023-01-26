"use strict";
exports.__esModule = true;
exports.resolveImage = void 0;
function resolveImage(image) {
    return image == null
        ? require("@/assets/no-image.png")
        : process.env.VUE_APP_API_URL + "storage/attachments/" + image;
}
exports.resolveImage = resolveImage;
