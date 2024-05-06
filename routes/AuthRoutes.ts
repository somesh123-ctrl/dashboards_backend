import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import nodemailer from 'nodemailer';
import LoginSession from '../models/LoginSession';
import jwt, { JwtPayload } from 'jsonwebtoken';
import LoginLogoutActivity from '../models/LoginLogoutActivity';

const router = express.Router();

// Function to generate OTP
const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'demo1email2for3project@gmail.com',
    pass: 'hpaa abyu tssh axvf'
  }
});

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route for sending OTP
router.post('/sendotp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'User not found' });
    }
console.log(process.env.EMAIL_ADDRESS)
    const otp = generateOTP();

    // Save OTP to user document
    existingUser.otp = otp;
    await existingUser.save();

    // Send OTP to user's email
    await transporter.sendMail({
      from: 'demo1email2for3project@gmail.com',
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP for login is: ${otp}`
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route with OTP verification
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, otp } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify OTP
    if (existingUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Detecting device type from user-agent header
    const userAgent = req.headers['user-agent'];
    let deviceType = 'Unknown';

  
    if (userAgent) {
      if (/(android|iphone|ipad)/i.test(userAgent)) {
        deviceType = 'Mobile';
      } else if (/(windows|macintosh|linux)/i.test(userAgent)) {
        deviceType = 'Desktop';
      }
    }

 
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "dfdfgdgdgfdgfdg", { expiresIn: '1h' });

    // Save login session data to database with device type
    const loginSession = new LoginSession({
      email,
      deviceType,
    });
    await loginSession.save();

    const loginLogoutActivity = new LoginLogoutActivity({
      email,
      deviceType,
    });
    await loginLogoutActivity.save();

    await transporter.sendMail({
      from: 'vijaydeverkonda43@gmail.com',
      to: email,
      subject: 'New Device login ',
      text: `New device login from : ${deviceType} `
    });

    res.status(200).json({ result: existingUser, token , loginSession , loginLogoutActivity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update logout date route
router.put('/sessions/:sessionId/logout', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await LoginLogoutActivity.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.logoutAt = new Date();
    await session.save();

    res.status(200).json({ message: 'Logout date updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//route to fetch sessions for the current user
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    // Ensure that authorization header is present
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token from authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token to get user information
    const decodedData = jwt.verify(token, "dfdfgdgdgfdgfdg") as JwtPayload;

  
    if (!decodedData.email) {
      return res.status(400).json({ message: 'Email not found in decoded data' });
    }

    // Find sessions for the current user using the user's email
    const sessions = await LoginSession.find({ email: decodedData.email });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// route to fetch sessions for the current user
router.get('/useractivity', async (req: Request, res: Response) => {
  try {
    // Ensure that authorization header is present
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token from authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token to get user information
    const decodedData = jwt.verify(token, "dfdfgdgdgfdgfdg") as JwtPayload;


    if (!decodedData.email) {
      return res.status(400).json({ message: 'Email not found in decoded data' });
    }

    // Find sessions for the current user using the user's email
    const sessions = await LoginLogoutActivity.find({ email: decodedData.email });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Backend route to delete a session
router.delete('/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Find the session by ID and delete it
    const deletedSession = await LoginSession.findByIdAndDelete(sessionId);

    if (!deletedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session sign-out successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
export default router;
