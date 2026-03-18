import { Router } from 'express';
import { AuthController } from './auth.controller';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { sendOtpSchema, registerSchema, loginSchema } from './auth.validation';

const router = Router();

router.post('/otp/send', validateRequest(sendOtpSchema), AuthController.sendOtp);
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', auth, AuthController.getMe);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', auth, AuthController.logout);

export default router;
