import {Router} from "express";
import {login,signup,logout,change, reset,deleteuser} from "../controllers/authcontroller.js"
import {tokenverification} from "./middleware/verifytoken.js"

const router= Router();
router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",logout);
router.post("/change",tokenverification,change);
router.post("/reset",reset);
router.post("/delete",deleteuser);


export default router;
