import express from "express"
import { Follow, Login, Logout, Register, Unfollow, bookmark, getmyprofile, getotheruser } from "../controlers/usercontroler.js";
import isAuthenticated from "../DB/auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/bookmark/:id").put(isAuthenticated, bookmark);
router.route("/profile/:id").get(isAuthenticated,getmyprofile);
router.route("/otheruser/:id").get(isAuthenticated,getotheruser);
router.route("/follow/:id").post(isAuthenticated,Follow);
router.route("/unfollow/:id").post(isAuthenticated,Unfollow);
export default router;