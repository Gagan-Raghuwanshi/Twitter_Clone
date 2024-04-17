import express from "express"
import { LikeOrDislike, createTweet, deletetweet, getFollowingTweet, getalltweet } from "../controlers/tweet.controler.js";
import isAuthenticated from "../DB/auth.js";


const router = express.Router();

router.route("/create").post(isAuthenticated ,createTweet);
router.route("/delete/:id").delete(isAuthenticated,deletetweet);
router.route("/like/:id").put(isAuthenticated,LikeOrDislike);
router.route("/getalltweet/:id").get(isAuthenticated,getalltweet);
router.route("/getfollowingusertweet/:id").get(isAuthenticated,getFollowingTweet);


export default router;