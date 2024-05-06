import mongoose, { Schema, Document } from 'mongoose';


export interface ILoginLogoutActivity extends Document {
  email: string;
  deviceType: string;
  createdAt: Date;
  logoutAt: Date;
}


const LoginLogoutActivitySchema: Schema = new Schema({
  email: { type: String, required: true },
  deviceType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  logoutAt: { type: Date, default: null }
});

export default mongoose.model<ILoginLogoutActivity>('LoginLogoutActivity', LoginLogoutActivitySchema);
