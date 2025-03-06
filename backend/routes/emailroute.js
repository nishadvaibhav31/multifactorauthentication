import { Router } from "express";
import { otpgen,verifyotp } from "../controllers/emailcontroller.js";
const router = Router();
router.post('/otpgeneration',otpgen);
router.post('/verifyotp',verifyotp);
export default router ;