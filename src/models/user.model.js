import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema  = new mongoose.Schema({
    username:{
        type: String,
        require:true,
        unique:true,
        trim:true,
        minlength:3,
        maxlength:20
    },
    email:{
        type: String,
        require: [true,"Email is required"],
        unique:true,
        trim:true
    },
    password:{
        type: String,
        require: [true,"Password is required"],
        trim:true,
        minlength:6
    },
    profilePicture:{
        type: String,

    },
    coverImage:{
        type: String,
    },
    bio:{
        type: String,
        default:""
    },
    
    badge:{
        type: String,
        default:""
    },
    readingList:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'ReadingList'
        }
    ],
    library:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Story'

        }
    ],
    refreshToken:{
        type: String,
        require:true,
    },
    
},{timestamp: true})

// prehook 
// middleware [next is a flag which will tell that the function has been executed]
userSchema.pre(
    "save", async function(next){
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();


});

// custom methods
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
    
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:`${process.env.ACCESS_TOKEN_EXPIRY}`});
}
// refresh token has less information than access token, and we use it oftenly
userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign({_id:this._id}, process.env.REFESH_TOKEN_SECRET, {expiresIn: "7d"});
}




export const User = mongoose.model('User',userSchema);