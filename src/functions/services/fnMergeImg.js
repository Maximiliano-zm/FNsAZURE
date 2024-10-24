import sharp from "sharp";
import { Buffer } from "buffer";
const mergeImgs = async (content1, content2) => {
  try {
    const content1Data = content1.split(";base64,").pop();
    const content2Data = content2.split(";base64,").pop();
    const buffer1 = Buffer.from(content1Data, "base64"); // Imagen Base
    const buffer2 = Buffer.from(content2Data, "base64"); // Imagen Overlay
    const b64 = (
      await sharp(buffer1)
        .composite([{ input: buffer2 }])
        .toBuffer()
    ).toString("base64");
    return b64;
  } catch (error) {
    console.error("Error al fusionar imágenes:", error);
    throw new Error("Error al fusionar imágenes");
  }
};
const mergeImg = async (request) => {
  const imagenes = request;
  try {
    const content1 = imagenes.img1["$content"];
    const content2 = imagenes.img2["$content"];
    const mergeImgsB64 = await mergeImgs(content1, content2);
    return mergeImgsB64;
  } catch (error) {
    console.error("Error en mergeImg:", error);
    throw new Error("Error en el servicio de fusión de imágenes");
  }
};
export default mergeImg;
