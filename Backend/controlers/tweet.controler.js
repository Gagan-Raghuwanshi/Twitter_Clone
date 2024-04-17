// import { Promise } from "mongoose";
import {Tweet} from "../models/tweetschema.js";
import {User} from "../models/userschema.js";

// Create Tweet

export const createTweet = async (req,res)=>{
    try {
        const {description, id} = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message:"Fields are required",
                success:false
            })
        };
        const user = await User.findById(id).select("-password")
        await Tweet.create({
            description,
            userId:id,
            userDetails:user
        });
        return res.status(201).json({
            message:"Tweet created successfully.",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

// Delete tweet

export const deletetweet = async (req,res)=>{
    try {
        const {id} = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

// Like or dislike user

export const LikeOrDislike = async (req,res)=>{
    try {
        const loggedinuserid = req.body.id;
        const tweetid = req.params.id;
        const tweet = await Tweet.findById(tweetid);
        if(tweet.like.includes(loggedinuserid)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetid,{$pull:{like:loggedinuserid}});
            return res.status(200).json({
                message:"user disliked your tweet"
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetid,{$push:{like:loggedinuserid}});
            return res.status(200).json({
                message:"user liked your tweet"
            })

        }
    } catch (error) {
        console.log(error)
    }
}

// Get all tweet

export const getalltweet =async (req,res)=>{
    try {

        // we have to get loggedin user tweet and following user tweet
        const id = req.params.id;
        const loggedinuser = await User.findById(id);
        const loggedinusertweet = await Tweet.find({userId:id});
        const followingusertweet = await Promise.all(loggedinuser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:loggedinusertweet.concat( ...followingusertweet)
        })

    } catch (error) {
        console.log("dhd",error)
    }
}

// Following user tweet

export const getFollowingTweet = async (req,res)=>{
    try {
        // we have to get following user tweet
        const id = req.params.id;
        const loggedinuser = await User.findById(id);
        const followingusertweet = await Promise.all(loggedinuser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:[].concat( ...followingusertweet)
        })
    } catch (error) {
        console.log(error)
    }
}