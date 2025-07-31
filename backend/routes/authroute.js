import {Router} from "express";
import {login,signup,logout, reset} from "../controllers/authcontroller.js"
import {tokenverification} from "../middleware/verifytoken.js"

const router= Router();
router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",logout);
router.post("/reset",reset);


export default router;
