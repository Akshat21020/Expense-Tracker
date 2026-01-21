import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
    name : {type : String , required : [true , "Required"]},
    email : {type : String , unique : true , required : [true , "Required"]},
    password : {type : String , unique : true ,required : [true , "Required"], minlength : [6, "Password Must Be Atleast 6 characters"]},
    currency: { type: String, default: "INR" }

}
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
  });

export default mongoose.model( "User", userSchema);