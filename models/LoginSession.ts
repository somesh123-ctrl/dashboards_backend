import mongoose, { Schema, Document } from 'mongoose';

// Define interface for login session document
export interface ILoginSession extends Document {
  email: string;
  deviceType: string;
  createdAt: Date;
  // logoutAt: Date;

}

// Define schema for login session
const LoginSessionSchema: Schema = new Schema({
  email: { type: String, required: true },
  deviceType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // logoutAt: { type: Date, default: null }
});

// Define and export the LoginSession model
export default mongoose.model<ILoginSession>('LoginSession', LoginSessionSchema);
