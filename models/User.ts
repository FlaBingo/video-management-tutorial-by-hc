import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next();
})

const User = models?.User || model<IUser>("User", userSchema);
// The expression models?.User is a common pattern used in Next.js applications to prevent a Mongoose OverwriteModelError. This error happens when you try to define a model that has already been compiled and stored in Mongoose's internal models object.

// In a traditional Node.js application, this isn't usually an issue because the code that defines your models only runs once when the application starts.
// However, in Next.js, which you're learning, a new serverless function instance can be created for each API route handler. Each time a request comes in and a new instance spins up, the module that defines your Mongoose model might be re-evaluated. Without the models?.User || model(...) pattern, this re-evaluation would try to create the User model again, leading to the error because Mongoose's internal model registry already has a model named "User."

export default User;