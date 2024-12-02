import { Router } from 'express';
import { uploadFile, deleteFile } from '../controllers/file.controller.js';
import fileUploader from '../middlewares/multer.middleware.js';

const router = Router();

router
  .route('/upload')
  .post(fileUploader.fields([{ name: 'File', maxCount: 1 }]), uploadFile);

router.route('/delete').delete(deleteFile);

export default router;
