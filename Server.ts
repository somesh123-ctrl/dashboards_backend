import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://someshshirpe123:lXUi1Pq3lkjHXmBX@cluster0.vkg5hee.mongodb.net/demo")
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.error(error.message));

//   mongoose.set('useFindAndModify', false as any);
