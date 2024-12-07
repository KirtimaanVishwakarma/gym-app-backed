import { Router } from 'express';
import {
  registerAdminUser,
  resetAdminPassword,
  adminLogin,
  updateProfile,
  adminLogout,
  refreshToken,
} from '../controllers/admin-user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post(registerAdminUser);
router.route('/reset-password').post(resetAdminPassword);
router.route('/login').post(adminLogin);

// secured routes
router.route('/logout').get(verifyJWT, adminLogout);
router.route('/update-profile/:id').patch(verifyJWT, updateProfile);
router.route('/refresh-token').post(verifyJWT, refreshToken);

export default router;
