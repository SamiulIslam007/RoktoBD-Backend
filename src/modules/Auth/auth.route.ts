import { Router } from 'express';
import { AuthController } from './auth.controller';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { sendOtpSchema, verifyOtpSchema } from './auth.validation';

const router = Router();

router.post('/otp/send', validateRequest(sendOtpSchema), AuthController.sendOtp);
router.post('/otp/verify', validateRequest(verifyOtpSchema), AuthController.verifyOtp);
router.get('/me', auth, AuthController.getMe);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', auth, AuthController.logout);

export default router;
