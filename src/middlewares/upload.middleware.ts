import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinaryConfig";
import path from "path";

const uploadMiddleware = (foldername: string) => {
  try {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        const folderPath = foldername.trim();
        const fileExtension = path.extname(file.originalname).substring(1);
        const publicId = `${file.fieldname} - ${Date.now()}`;

        return {
          folder: folderPath,
          public_id: publicId,
          format: fileExtension,
        };
      },
    });

    return multer({
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default uploadMiddleware;
