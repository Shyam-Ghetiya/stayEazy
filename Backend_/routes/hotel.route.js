// All routers code should be update here

// import { Router } from "express";
import { getDetailsOfHotel, handleSearchRequest, RegisterHotel, getRandomHotels } from "../controllers/hotels.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { handleAddRatings } from "../controllers/user.controller.js";

import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { newmessage } from '../controllers/registerhandle.js';

const router = express.Router();

import { handlBookingcancellation, handleBookingRequest, checkBookingCredential } from "../controllers/bookings.controller.js"
import authMiddleware from "../middlewares/authMiddleware.js";


router.post("/createmessage", newmessage);



const JWT_SECRET = 'your-secret-key';

router.get('/api/v1/verify-token', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user details if needed
        // const user = await User.findById(decoded.userId);

        res.json({
            success: true,
            user: {
                id: decoded.userId,
                email: decoded.email,
                // Add other non-sensitive user details as needed
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

router.get("/getRandomHotels",getRandomHotels);

router.route("/hotelRegister").post(
    upload.fields([
        {
            name: "images",
            maxCount: 6
        }
    ]),
    RegisterHotel
);


router.post("/search", handleSearchRequest);

router.post("/:hotelId/check-availability", checkBookingCredential);

router.post("/:hotelId/confirm-booking", authMiddleware, handleBookingRequest);

router.post("/:hotelId/addRatings",
    authMiddleware,
    handleAddRatings
);

router.delete("/:bookingId", handlBookingcancellation);

router.get("/:hotelId", getDetailsOfHotel);

export default router
