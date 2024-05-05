import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  otp: string;  // Define the secret property as optional
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String } // Define the secret property
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
