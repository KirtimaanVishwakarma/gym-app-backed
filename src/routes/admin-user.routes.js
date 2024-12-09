import { Router } from 'express';
import {
  registerAdminUser,
  resetAdminPassword,
  adminLogin,
  updateProfile,
  adminLogout,
  refreshToken,
  getAdminDetails,
  getOwnDetails,
  toggleAdmin,
  updatePassword,
} from '../controllers/admin-user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
const router = Router();
//create middleware for protected routes based on roles
router.route('/register').post(registerAdminUser);
router.route('/reset-password').post(resetAdminPassword);
router.route('/login').post(adminLogin);

// secured routes
router.route('/logout').get(verifyJWT, adminLogout);
router.route('/update-profile/:id').patch(verifyJWT, updateProfile);
router.route('/update-password/:id').patch(verifyJWT, updatePassword);
router.route('/toggle').patch(verifyJWT, toggleAdmin);
router.route('/profile/:id').get(verifyJWT, getAdminDetails);
router.route('/profile').get(verifyJWT, getOwnDetails);
router.route('/refresh-token').post(verifyJWT, refreshToken);

export default router;
