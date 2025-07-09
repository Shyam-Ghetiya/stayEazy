import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { HotelDetails } from "../models/hotel.model.js";
import { BookingDetails } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

// const handleBookingRequest = asyncHandler(async (req, res) => {
//     // data from body
//     // validation
//     // check if hotel already exist
//     // check for images
//     // upload them to cloudinary
//     // create user object - create entry in db
//     // remove password field from response
//     // check for hotel creation
//     // return response

//     const { firstName, lastName, email, checkInDate, checkOutDate, phone, roomCount, totalCost } = req.body;
    
//     // console.log(req.body);
//     const userId = req.user?.userId;
//     // const userId = "673724f88f99e1e032f07dbc";
//     const hotelId = req.params.hotelId;
//     // const userId = Math.random().toString(36).substring(2, 12);
//     // console.log(userId);
    
//     if (!firstName || !lastName || !email || !checkInDate || !checkOutDate || !phone || !roomCount || !totalCost) {
//         throw new ApiError(400,  "All mandatory field is required");
//     }

//     const hotel = await HotelDetails.findById(hotelId);

//     if (!hotel) {
//         throw new ApiError(404, "Hotel not found");
//     }
//     const booking = await BookingDetails.create({
//         userId,
//         hotelId,
//         firstName,
//         lastName,
//         email,
//         phone,
//         roomCount,
//         checkInDate,
//         checkOutDate,
//         totalCost
//     });

//     const createdBooking = await BookingDetails.findById(booking._id).select(
//         "-__v"
//     );

//     if (!createdBooking) {
//         throw new ApiError(500, "something went wrong while confirming the booking")
//     }

//     // // Now, add bookingId to the `bookings` array in the hotel document
//     // await HotelDetails.findByIdAndUpdate(
//     //     hotelId, // ID of the hotel
//     //     { $push: { bookings: bookingId } }, // Push the booking _id to bookings array
//     //     { new: true, useFindAndModify: false } // Options: return updated document and avoid deprecated warnings
//     // );

//     hotel.bookings.push(createdBooking._id);

//     await hotel.save({ validateBeforeSave: false });

//     // Enter the booking into the user as well.
//     await User.findByIdAndUpdate(
//         userId,
//         { $push: { bookingHistory: createdBooking._id } },
//         { new: true, useFindAndModify: false } // Options to avoid deprecated warnings and get the updated document
//     );

//     res.status(201).json(
//         new ApiResponse(201, booking, "Booking confirmed successfully")
//     )
// });


// Check booking credential before going to booking confirm page
const checkBookingCredential = asyncHandler(async(req,res)=>{
    const {checkInDate, checkOutDate, requiredRooms} = req.body

    if(!checkInDate || !checkOutDate || !requiredRooms){
        throw new ApiError(400, "Check-In-Date, Check-Out-Date and Number of Rooms must be provided")
    }

    if(typeof checkInDate === 'string' && checkInDate.trim() === "" || 
       typeof checkOutDate === 'string' && checkOutDate.trim() === "" ||
       Number(requiredRooms) <= 0){
        throw new ApiError(400, "Check-In-Date, Check-Out-Date and Number of Rooms must be provided")
    }

    const hotelID = req.params.hotelId;

    const hotel = await HotelDetails.findById(hotelID);

    if(!hotel){
        throw new ApiError(400, "Hotel doesn't found with this hotel ID");
    }

    // Convert requiredRooms to number to ensure proper comparison
    const requiredRoomsNum = Number(requiredRooms);

    // Convert dates to proper Date objects and set time to start/end of day
    const checkInDateObj = new Date(checkInDate + 'T00:00:00.000Z');
    const checkOutDateObj = new Date(checkOutDate + 'T23:59:59.999Z');

    // console.log('Debug Info:', {
    //     hotelId: hotelID,
    //     hotelRoomCount: hotel.roomCount,
    //     requiredRooms: requiredRoomsNum,
    //     checkInDate: checkInDateObj,
    //     checkOutDate: checkOutDateObj
    // });

    // First, let's check if there are any existing bookings for this hotel
    const allBookings = await BookingDetails.find({ hotelId: hotel._id });
    // console.log('All bookings for this hotel:', allBookings.length);

    const bookedRooms = await BookingDetails.aggregate([
        {
            $match: {
                hotelId: new mongoose.Types.ObjectId(hotelID),
                $and: [
                    { checkInDate: { $lte: checkOutDateObj } },
                    { checkOutDate: { $gte: checkInDateObj } }
                ]
            }
        },
        {
            $group: {
                _id: "$hotelId",
                totalRoomsBooked: { $sum: "$roomCount" }
            }
        }
    ]);

    // console.log('Aggregation result:', bookedRooms);

    const totalRoomsBooked = bookedRooms.length > 0 ? bookedRooms[0].totalRoomsBooked : 0;
    const availableRooms = hotel.roomCount - totalRoomsBooked;

    // console.log('Availability Debug:', {
    //     totalRoomsBooked,
    //     availableRooms,
    //     requiredRoomsNum,
    //     isAvailable: availableRooms >= requiredRoomsNum,
    //     hotelRoomCount: hotel.roomCount
    // });

    // Check if the available rooms meet the required number of rooms
    if (availableRooms >= requiredRoomsNum) {
        res
        .status(200)
        .json({
            success: true,
            data: hotel,
            availableRooms,
            message: "Rooms are available for booking during this time"
        })
    }
    else{
        res
        .status(200)
        .json({
            success: false,
            data: hotel,
            availableRooms,
            message: `Not enough rooms to book during this time. Available: ${availableRooms}, Required: ${requiredRoomsNum}`
        })
    }
});

// confirm booking

const handleBookingRequest = asyncHandler(async (req, res) => {
    // data from body
    // validation
    // check if hotel already exist
    // check for images
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password field from response
    // check for hotel creation
    // return response

    const { firstName, lastName, email, checkInDate, checkOutDate, phone, roomCount, totalCost, paymentMethod, hotelName, pricePerNight, gst, baseCost, stayDuration } = req.body;
    
    // console.log(req.body);
    const userId = req.user?.userId;
    // const userId = "673724f88f99e1e032f07dbc";
    const hotelId = req.params.hotelId;
    // const userId = Math.random().toString(36).substring(2, 12);
    // console.log(userId);
    
    if (!firstName || !lastName || !email || !checkInDate || !checkOutDate || !phone || !roomCount || !totalCost) {
        throw new ApiError(400,  "All mandatory field is required");
    }

    const hotel = await HotelDetails.findById(hotelId);

    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    // Check room availability before booking
    const checkInDateObj = new Date(checkInDate + 'T00:00:00.000Z');
    const checkOutDateObj = new Date(checkOutDate + 'T23:59:59.999Z');
    
    const bookedRooms = await BookingDetails.aggregate([
        {
            $match: {
                hotelId: new mongoose.Types.ObjectId(hotelId),
                $and: [
                    { checkInDate: { $lte: checkOutDateObj } },
                    { checkOutDate: { $gte: checkInDateObj } }
                ]
            }
        },
        {
            $group: {
                _id: "$hotelId",
                totalRoomsBooked: { $sum: "$roomCount" }
            }
        }
    ]);

    const totalRoomsBooked = bookedRooms.length > 0 ? bookedRooms[0].totalRoomsBooked : 0;
    const availableRooms = hotel.roomCount - totalRoomsBooked;

    if (availableRooms < roomCount) {
        throw new ApiError(400, `Not enough rooms available. Only ${availableRooms} rooms are available for the selected dates.`);
    }

    const booking = await BookingDetails.create({
        userId,
        hotelId,
        firstName,
        lastName,
        email,
        phone,
        roomCount,
        checkInDate,
        checkOutDate,
        totalCost
    });

    const createdBooking = await BookingDetails.findById(booking._id).select(
        "-__v"
    );

    if (!createdBooking) {
        throw new ApiError(500, "something went wrong while confirming the booking")
    }

    // // Now, add bookingId to the `bookings` array in the hotel document
    // await HotelDetails.findByIdAndUpdate(
    //     hotelId, // ID of the hotel
    //     { $push: { bookings: bookingId } }, // Push the booking _id to bookings array
    //     { new: true, useFindAndModify: false } // Options: return updated document and avoid deprecated warnings
    // );

    hotel.bookings.push(createdBooking._id);

    await hotel.save({ validateBeforeSave: false });

    // Enter the booking into the user as well.
    await User.findByIdAndUpdate(
        userId,
        { $push: { bookingHistory: createdBooking._id } },
        { new: true, useFindAndModify: false } // Options to avoid deprecated warnings and get the updated document
    );

    // Send email confirmation
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shyamdummy10@gmail.com', // Add this to your .env file
                pass:  'bfzodqaskcnrgiyr'// Add this to your .env file (Gmail app password)
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Booking Confirmation - ${hotelName || hotel.hotelName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="text-align: center; background-color: #007b7b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; font-size: 24px;">stayEazy</h1>
                        <p style="margin: 5px 0 0 0; font-size: 16px;">Booking Confirmation</p>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p style="font-size: 16px; color: #333;">Dear <strong>${firstName} ${lastName}</strong>,</p>
                        <p style="font-size: 16px; color: #333;">Your booking has been confirmed successfully!</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #007b7b; margin-top: 0;">Booking Details:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Hotel:</td>
                                    <td style="padding: 8px 0; color: #333;">${hotelName || hotel.hotelName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Check-in:</td>
                                    <td style="padding: 8px 0; color: #333;">${new Date(checkInDate).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Check-out:</td>
                                    <td style="padding: 8px 0; color: #333;">${new Date(checkOutDate).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Duration:</td>
                                    <td style="padding: 8px 0; color: #333;">${stayDuration || Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} night(s)</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Rooms:</td>
                                    <td style="padding: 8px 0; color: #333;">${roomCount}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Payment Method:</td>
                                    <td style="padding: 8px 0; color: #333;">${paymentMethod ? paymentMethod.replace('_', ' ').toUpperCase() : 'Not specified'}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #007b7b; margin-top: 0;">Payment Details:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Price per night:</td>
                                    <td style="padding: 8px 0; color: #333;">₹${pricePerNight || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Base cost:</td>
                                    <td style="padding: 8px 0; color: #333;">₹${baseCost ? baseCost.toFixed(2) : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">GST (18%):</td>
                                    <td style="padding: 8px 0; color: #333;">₹${gst ? gst.toFixed(2) : 'N/A'}</td>
                                </tr>
                                <tr style="border-top: 2px solid #007b7b;">
                                    <td style="padding: 8px 0; font-weight: bold; color: #007b7b; font-size: 18px;">Total amount:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #007b7b; font-size: 18px;">₹${totalCost.toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <p style="font-size: 16px; color: #333;">Thank you for choosing <strong>stayEazy</strong>!</p>
                            <p style="font-size: 14px; color: #666;">If you have any questions, please contact our support team.</p>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0; font-size: 12px; color: #666;">© 2024 stayEazy. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent successfully');
    } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw error here as booking is already successful
        // Just log the error
    }

    res.status(201).json(
        new ApiResponse(201, booking, "Booking confirmed successfully")
    )
});


//Booking Cancellation
const handlBookingcancellation = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    try {
        const booking = await BookingDetails.findById(bookingId);
        
        //check booking is exist or not
        if (!booking) {
            throw new ApiError(404, "Booking Not Found!"); 
        }

        const currentDate = new Date();
        const checkInDate = new Date(booking.checkInDate);

        // if currentDate exceeds checkInDate than user cann't cancel rooms
        if (currentDate > checkInDate) {   
            throw new ApiError(400, "Cannot cancel after Check In");
        }

        // check if hotel exists
        const hotel = await HotelDetails.findById(booking.hotelId);
        if (!hotel) {
            throw new ApiError(404,"Associated hotel not found");
        }
        
        // No need to update roomCount as it's the total rooms, not available rooms
        // The available rooms are calculated dynamically based on existing bookings

        //Remove booking from hotel dataBase
        hotel.bookings = hotel.bookings.filter((id) => id.toString() !== bookingId);
        await hotel.save();

        const user = await User.findById(booking.userId);
        if (user) {
            //Remove booking from the user's booking history
            user.bookingHistory = user.bookingHistory.filter((id) => id.toString() !== bookingId);
            await user.save();
        }
        
        //delete booking 
        await BookingDetails.findByIdAndDelete(bookingId);
        
        res.status(200).json(
            new ApiResponse(200, null, "Booking successfully canceled and rooms updated")
        );

    } catch (error) {
        throw new ApiError(500,error.message || 'Internal Server Error');
    }

});

export {
    handleBookingRequest,
    checkBookingCredential,
    handlBookingcancellation
}
