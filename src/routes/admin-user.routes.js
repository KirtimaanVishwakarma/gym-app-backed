import { Router } from 'express';
import {
  registerAdminUser,
  resetAdminPassword,
  adminLogin,
  updateProfile,
  adminLogout,
} from '../controllers/admin-user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post(registerAdminUser);
router.route('/reset-password').post(resetAdminPassword);
router.route('/login').post(adminLogin);

// secured routes
router.route('/logout').get(verifyJWT, adminLogout);
router.route('/update-profile').post(verifyJWT, updateProfile);

export default router;
