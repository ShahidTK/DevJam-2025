import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({ 
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    coverPhoto: {
        type: String
    },
    avatar: {
        type: String,
    },
    refreshToken: { 
        type: String
    },
    fullName: { 
        type: String,
        trim: true,
    }
    
}, { timestamps: true });
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}
userSchema.method.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username:this.username,
            fullName: this.fullName,
            email: this.email,
        },
         process.env.ACCESS_TOKEN_SECRET, 
         {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}); 
}
userSchema.method.generataRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username:this.username,
            fullName: this.fullName,
            email: this.email,
        },
         process.env.REFRESH_TOKEN_SECRET, 
         {expiresIn: process.env.
            REFRESH_TOKEN_EXPIRY}); 
}

const User = mongoose.model('User', userSchema);    
export default User;
