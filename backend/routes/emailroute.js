import { Router } from "express";
import rateLimit from "express-rate-limit";
import { otpgen,otpgens,verifyotp } from "../controllers/emailcontroller.js";
const router = Router();
const otpLimiterotpgen = rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
    max: 4, // Limit each IP to 5 requests per windowMs
    message: 'Too many OTP Generation attempts from this IP, please try again after 2 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 4, // Limit each IP to 3 requests per windowMs
    message: 'Too many OTP verification attempts from this IP, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
router.post('/otpgeneration',otpLimiterotpgen,otpgen);
router.post('/otpgenerations',otpLimiterotpgen,otpgens);
router.post('/verifyotp',otpLimiter,verifyotp);
export default router ;
