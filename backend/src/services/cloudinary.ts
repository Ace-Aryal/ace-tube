import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "dsdevazn9",
  api_secret: process.env.CLOUDINARY_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

export async function uploadToCloudinary(localeFilePath: string) {
  try {
    if (!localeFilePath) return;
    const fileExistsInServer = fs.existsSync(localeFilePath);
    if (!fileExistsInServer) return;
    const uploadRes = await cloudinary.uploader.upload(localeFilePath, {
      resource_type: "auto",
    });
    console.log("file uploaded", uploadRes.url);
    fs.unlinkSync(localeFilePath);

    return uploadRes;
  } catch (error) {
    console.error(error, "upload error");
    // remove the locally saved temporary file as the upload got failed
    fs.unlinkSync(localeFilePath);
    return;
  }
}
