import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constans/index.js';
import dotenv from 'dotenv';
dotenv.config();

export const saveFileToUploadDir = async (file) => {
  const tempFilePath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const uploadFilePath = path.join(UPLOAD_DIR, file.filename);

  try {
    await fs.access(tempFilePath);
  } catch (error) {
    throw new Error(`File not found in temp directory: ${tempFilePath}`);
  }

  try {
    await fs.rename(tempFilePath, uploadFilePath);
  } catch (error) {
    throw new Error(
      `Failed to move file from ${tempFilePath} to ${uploadFilePath}: ${error.message}`,
    );
  }

  return `${process.env.APP_DOMAIN}/uploads/${file.filename}`;
};
