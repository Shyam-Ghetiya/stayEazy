import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

const hotelDetailsSchema = new Schema({
    hotelName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    roomCount: {
        type: Number,
        required: true
    },

    facilities: {
        type: [String],
        default: []
    },

    pricePerNight: {
        type: Number,
        required: true
    },
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: "Rating"
    }],
    images: {
        type: [String],
        default: [],
        // required: true
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BookingDetails'
        }
    ],
    contactNo: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        //required: [true, 'Password is required']
    }
}, {
    timestamps: true
});

hotelDetailsSchema.pre('save', async function(next) {

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
  

  hotelDetailsSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };

export const HotelDetails = mongoose.model("HotelDetails", hotelDetailsSchema);
