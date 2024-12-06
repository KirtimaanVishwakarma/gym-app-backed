import { Router } from 'express';
import {
  registerAdminUser,
  resetAdminPassword,
} from '../controllers/admin-user.controller.js';
const router = Router();

router.route('/register').post(registerAdminUser);
router.route('/reset-password').post(resetAdminPassword);

export default router;
