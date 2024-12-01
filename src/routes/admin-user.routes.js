import { Router } from 'express';
import { registerAdminUser } from '../controllers/admin-user.controller.js';
const router = Router();

router.route('/register').post(registerAdminUser);

export default router;
