import sharp from "sharp";
import { Buffer } from "buffer";

const resizeImage = async (buffer, width, height) => {
  return await sharp(buffer)
    .resize(width, height)
    .toBuffer();
};

const mergeImgs = async (content1, content2) => {
  try {
    const content1Data = content1.split(";base64,").pop();
    const content2Data = content2.split(";base64,").pop();
    let buffer1 = Buffer.from(content1Data, "base64"); // Imagen Base
    let buffer2 = Buffer.from(content2Data, "base64"); // Imagen Overlay
    
    // Resize buffers
    buffer1 = await resizeImage(buffer1, 480, 640);
    buffer2 = await resizeImage(buffer2, 480, 640);

    const b64 = (
      await sharp(buffer1)
        .composite([{ input: buffer2 }])
        .toBuffer()
    ).toString("base64");
    
    return b64;
  } catch (error) {
    console.error("Error al fusionar imagenes:", error);
    throw new Error("Error al fusionar imagenes");
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
    throw new Error("Error en el servicio de fusion de imagenes");
  }
};

export default mergeImg;
