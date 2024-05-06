import mongoose, { Schema, Document } from 'mongoose';


export interface ILoginSession extends Document {
  email: string;
  deviceType: string;
  createdAt: Date;
  // logoutAt: Date;

}


const LoginSessionSchema: Schema = new Schema({
  email: { type: String, required: true },
  deviceType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // logoutAt: { type: Date, default: null }
});


export default mongoose.model<ILoginSession>('LoginSession', LoginSessionSchema);
