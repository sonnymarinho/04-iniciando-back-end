import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tempFolder,
  uploadsFolder: path.resolve(tempFolder, 'uploads'),
  directory: tempFolder,
  storage: multer.diskStorage({
    destination: tempFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};