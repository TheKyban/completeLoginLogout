import mongoose from "mongoose";

export default mongoose.model("Users",{
    name:String,
    email:String,
    password:String
})