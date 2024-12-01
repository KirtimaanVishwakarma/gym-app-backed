import { Router } from 'express';
import { registerAdminUser } from '../controllers/adminUser.controller.js';
const router = Router();

router.route('/register').post(registerAdminUser);

export default router;
