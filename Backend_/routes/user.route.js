import express from 'express'
import { login } from '../controllers/loginhandle.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';
import { googleSignIn } from '../controllers/googleAuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { updateProfile } from '../controllers/updateProfile.js';
import { handlegetPreviousBookings } from '../controllers/user.controller.js';
import { newmessage,verifyOtp,resendOtp } from '../controllers/registerhandle.js';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key';
const Router = express.Router();
// const router = express.Router();

Router.post("/createlogin", login);
Router.post("/createmessage", newmessage);
Router.post('/verify-otp', verifyOtp);
Router.post('/resend-otp', resendOtp);
Router.post("/forgot-password", forgotPassword);

Router.post("/reset-password", resetPassword);

Router.post("/google-signin", googleSignIn);
Router.put('/update-profile', authMiddleware, updateProfile);

Router.get("/bookig-history", authMiddleware, handlegetPreviousBookings);

const ADMIN_EMAIL = 'shyamghetiya1035@gmail.com';
const ADMIN_PASSWORD = 'shyam@123';

Router.post('/login-admin', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

    return res.json({ message: 'Login successful' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

Router.get('/verify-token', async (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      return res.status(200).json({
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          firstName : decoded.firstName,
          lastName : decoded.lastName,
          mobileNumber : decoded.mobileNumber
         
        }
      });
    } catch (error) {
        console.log(error);
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  });

export default Router