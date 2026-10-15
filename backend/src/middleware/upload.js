import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, '..', 'uploads', 'products');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG, WEBP and GIF images are allowed.', 400));
  }
};

/**
 * Multer uploader for product images.
 * Accepts up to 8 files under field name `images`.
 * Files land in backend/uploads/products and are served at /uploads/products/....
 */
export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).array('images', 8);

export const singleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

export const uploadsRootPath = path.join(__dirname, '..', 'uploads');

export default uploadProductImages;