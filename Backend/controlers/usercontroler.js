import { User } from "../models/userschema.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

// register controler
export const Register = async (req,res)=>{
    try{
        const {name, username, email, password } = req.body;
        // basic validation
        if (!name || !username || !email || !password ) {
            return res.status(200).json({
                message:"All fields are required",
                success:false
            })
        }
        const user = await User.findOne({email});
        if (user) {
            return res.status(201).json({
                message:"User is already exist",
                success:false
            })
        }

        const hashedpassword = await bcryptjs.hash(password,16);

        await User.create({
            name,
            username,
            email,
            password:hashedpassword
        });
        
        return res.status(201).json({
            message:"Account created successfully",
            success:true
        })

    } catch(error){
        console.log(error)
    }
}

// Login page controler 
export const Login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message:"All fields are required",
                success:true
            })
        }
        const user = await User.findOne({email});
        console.log(user)
        if (!user) {
            return res.status(401).json({
                message:"Incorrect Email or Password",
                success:false
            })
        }
        const ismatch = await bcryptjs.compare(password,user.password);
        if (!ismatch) {
            return res.status(401).json({
                message:"Incorrect Email or Password",
                success:false
            })
        }
        const tokenData = {
            userId:user._Id
        }
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"});
        return res.status(201).cookie("token",token,{expiresIn:"1d",httpOnly:true}).json({
            message:`welcome back ${user.name}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

// Logout page controler
export const Logout = (req,res)=>{
    return res.cookie("token","",{expiresIn:new Date(Date.now())}).json({
        message:"User Logged out successfully",
        success:true
    });
}

// Bookmark controler

export const bookmark = async (req,res)=>{
    try {
        const loggedinuserid = req.body.id;
        const tweetid = req.params.id;
        const user = await User.findById(loggedinuserid);
        if (user.bookmark.includes(tweetid)) {
            // Unbookmark
            await User.findById(loggedinuserid,{$pull:{bookmark:tweetid}});
            return res.status(200).json({
                message:"removed from bookmark"
            })
        }else{
            // bookmark
            await User.findByIdAndUpdate(loggedinuserid,{$push:{bookmark:tweetid}});
            return res.status(200).json({
                message:"saved to bookmark"
            })

        }
    } catch (error) {
        console.log(error)
    }
}

// profile controler

export const getmyprofile = async (req,res)=>{
    try {
        const id = req.params.id;
        const user =await User.findById(id).select("-password");
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error)
    }
}

// get other user

export const getotheruser = async (req,res)=>{
    try {
        const {id} = req.params;
        const otheruser = await User.find({_id:{$ne:id}}).select("-password");
        if (!otheruser) {
            return res.status(401).json({
                message:"Currently don't have any user"
            })
        };
        return res.status(200).json({
            otheruser
        })

    } catch (error) {
        console.log(error)
    }
}

// Follow user controle

export const Follow =async (req,res)=>{
    try {
        const loggedinuserid = req.body.id;
        const userid = req.params.id;
        const loggedinuser =await User.findById(loggedinuserid);
        const user = await User.findById(userid);
        if (!user.follower.includes(loggedinuserid)) {
            await user.updateOne({$push:{follower:loggedinuserid}});
            await loggedinuser.updateOne({$push:{following:userid}});
            return res.status(200).json({
                message:`${loggedinuser.name} just followed to ${user.name}`,
                success:true
            })
        }else{
            return res.status(400).json({
                message:`${loggedinuser.name} already followed to ${user.name}`
            })
        }
    } catch (error) {
        console.log(error)
    }
}

// Unfollow user controle

export const Unfollow = async (req,res)=>{
    try {
        const loggedinuserid = req.body.id;
        const userid = req.params.id;
        const loggedinuser =await User.findById(loggedinuserid);
        const user = await User.findById(userid);
        if (user.follower.includes(loggedinuserid)) {
            await user.updateOne({$pull:{follower:loggedinuserid}});
            await loggedinuser.updateOne({$pull:{following:userid}});
            
            return res.status(200).json({
                message:`${loggedinuser.name} just Unfollow to ${user.name}`,
                success:true
            })
        }else{
            return res.status(400).json({
                message:`${user.name} not in your following list `
            })

        }
    } catch (error) {
        console.log(error)
    }
}
