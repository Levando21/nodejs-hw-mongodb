import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constans/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('TEMP_UPLOAD_DIR:', TEMP_UPLOAD_DIR),
      console.log('Destination callback executed');
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    console.log('Destination callback executed');
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
