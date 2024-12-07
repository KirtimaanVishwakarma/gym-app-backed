import { Router } from 'express';
import { uploadFile, deleteFile } from '../controllers/file.controller.js';
import fileUploader from '../middlewares/multer.middleware.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = Router();

router
  .route('/upload')
  .post(
    verifyJWT,
    fileUploader.fields([{ name: 'File', maxCount: 1 }]),
    uploadFile
  );

router.route('/delete').delete(verifyJWT, deleteFile);

export default router;
