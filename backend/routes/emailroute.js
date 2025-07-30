import { Router } from "express";
import rateLimit from "express-rate-limit";
import { otpgen,otpgens,verifyotp,verifyotpls} from "../controllers/emailcontroller.js";
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
router.post('/otpgeneration',otpLimiterotpgen,otpgen);      //for login otp gen
router.post('/otpgenerations',otpLimiterotpgen,otpgens);   //for signup otp gen
router.post('/verifyotp',otpLimiter,verifyotp);           //for reset otp verify
router.post('/verifyotpls',otpLimiter,verifyotp);         //for login signup otp verify
export default router ;
