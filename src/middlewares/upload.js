import multer from 'multer';
import {
  TEMP_UPLOAD_DIR,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    console.log('ALLOWED_MIME_TYPES');
    cb(null, true);
  } else {
    cb(
      createHttpError(400, 'Invalid file type. Allowed: jpg, jpeg, png, webp'),
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
