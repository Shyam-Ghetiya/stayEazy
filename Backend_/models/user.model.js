import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt"

const messageapp = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    last_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    e_mail: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    mobile_number: {
      type: String,
      required: true,
      maxlength: 15,
      default: "Not provided" 
    },
    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
     
    },
    user_type: {
      type: String,
      enum: ['admin', 'customer', 'manager'],
      default: 'customer',
    },
    
    bookingHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "BookingDetails"
        }
    ],

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
  }
);


messageapp.pre('save', async function(next) {

    if (!this.isModified('password')) return next();
    
    try {
   
      this.password = await bcrypt.hash(this.password, 10);

      if (this.confirm_password && this.isModified('confirm_password')) {
        this.confirm_password = await bcrypt.hash(this.confirm_password, 10);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  });
  
  
  messageapp.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };
  
  
export const User = mongoose.model("User", messageapp);