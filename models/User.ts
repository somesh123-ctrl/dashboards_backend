import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  otp: string;  
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String } 
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
