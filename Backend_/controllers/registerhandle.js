import { User } from '../models/user.model.js'; 
import nodemailer from 'nodemailer';

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shyamdummy10@gmail.com',
    pass: 'bfzodqaskcnrgiyr'
  },
});

const newmessage = async (req, res) => {
  try {
    const { first_name, last_name, e_mail, mobile_number, password, confirm_password, user_type } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ e_mail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with OTP (not verified yet)
    const createmessage = await User.create({
      first_name,
      last_name,
      e_mail,
      mobile_number: mobile_number || "Not provided",
      password,
      user_type,
      otp,
      otpExpiry,
      isEmailVerified: false,
    });

    // Send OTP email
    await transporter.sendMail({
      from: 'shyamdummy10@gmail.com',
      to: e_mail,
      subject: "Your stayEazy Signup OTP",
      html: `<h2>Welcome to stayEazy!</h2>
        <p>Your OTP for email verification is:</p>
        <div style="font-size:2rem;letter-spacing:1rem;font-weight:bold;">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      data: createmessage,
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: "Error detected!",
      message: err.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ e_mail: email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }
    if (!user.otp || !user.otpExpiry || user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ e_mail: email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your stayEazy Signup OTP (Resent)",
      html: `<h2>Welcome to stayEazy!</h2>
        <p>Your OTP for email verification is:</p>
        <div style="font-size:2rem;letter-spacing:1rem;font-weight:bold;">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: "OTP resent to your email" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { newmessage , verifyOtp , resendOtp};