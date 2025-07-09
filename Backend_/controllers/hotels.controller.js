// Hotel Register, Search and all hotel related controllers should be here!!
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { HotelDetails } from "../models/hotel.model.js";
import { BookingDetails } from "../models/booking.model.js";
import { validationResult } from "express-validator";
import { Rating } from "../models/rating.model.js";


const getRandomHotels = async (req, res) => {
    try {
      // Fetch 8 random hotels using MongoDB
      const randomHotels = await HotelDetails.aggregate([
        { $sample: { size: 8 } } // Randomly select 8 hotels
      ]);
  
      // Send the response
      res.status(200).json({
        success: true,
        data: randomHotels
      });
    } catch (error) {
      // Handle any errors
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching random hotels",
        error: error.message
      });
    }
  };

const RegisterHotel = asyncHandler(async (req, res) => {
    // data from body
    // validation
    // check if hotel already exist
    // check for images
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password field from response
    // check for hotel creation
    // return response

    const { hotelName, city, country, address, description,
        roomCount, pricePerNight, contactNo, email, facilities, password } = req.body

    if (
        [hotelName, city, country, address, description,
            roomCount, pricePerNight, contactNo, email, password].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All mandatory field is required")
    }

    const existingHotel = await HotelDetails.findOne({email: email});
    if(existingHotel){
        return res.
        status(400).
        json(
            new ApiResponse(400, [], "Hotel with this email already exist!!")
        )
    }

    let imagesss;
    const imageUrls = [];

    if (req.files && Array.isArray(req.files.images) && req.files.images.length > 0) {
        imagesss = req.files.images;
        for (const image of imagesss) {
            const uploadurl = await uploadOnCloudinary(image.path);
            if (!uploadurl) {
                throw new ApiError(500, "Couldn't upload image on cloudinary");
            }
            imageUrls.push(uploadurl.url)
        }
    }
    
    let facilitiesArray = JSON.parse(facilities);

    const hotel = await HotelDetails.create({
        hotelName,
        city: city.toLowerCase(),
        country: country.toLowerCase(),
        address,
        description,
        roomCount,
        facilities: facilitiesArray,
        pricePerNight,
        contactNo,
        email,
        password,
        images: imageUrls
    })

    const createdHotel = await HotelDetails.findById(hotel._id).select(
        "-password -refreshToken"
    )

    if (!createdHotel) {
        throw new ApiError(500, "something went wrong while registering the hotel")
    }

    res.status(200).json(
        new ApiResponse(200, createdHotel, "Hotel Registered Successfully")
    )
})




const handleSearchRequest = asyncHandler(async (req, res) => {
    // data : {city, checkindate,checkoutdate, no of required rooms}
    // retrive all hotels - in the city, with available no of rooms during booking period
    //    --> retrive hotels which are in the city
    //    --> for each hotel look in bookingDetails and retrive no of booking of that hotel during booking period 
    //    --> store all hotels for which available room is more than required rooms


    const { city, checkInDate, checkOutDate, requiredRooms } = req.body
    
    // console.log('Search Request:', {
    //     city,
    //     checkInDate,
    //     checkOutDate,
    //     requiredRooms,
    //     hasRequiredRooms: requiredRooms && requiredRooms > 0,
    //     hasDates: checkInDate && checkOutDate
    // });
    
    if (!(city)) {
        throw new ApiError(400, "city/country/hotel name is required")
    }

    // Find hotels in the specified city
    const hotelsInCity = await HotelDetails.find({
        $or: [
            { city: new RegExp(city, "i") },
            { country: new RegExp(city, "i") },
            { hotelName: new RegExp(city, "i") }
        ]
    });

    // console.log(`Found ${hotelsInCity.length} hotels in ${city}`);

    if ((checkInDate && !checkOutDate) || (checkOutDate && !checkInDate)) {
        throw new ApiError(400, "Both CheckInDate and checkOutDate is required")
    }

    let availableHotels = [];
    
    // Convert requiredRooms to number and always check room availability if requiredRooms is provided
    const requiredRoomsNum = Number(requiredRooms);
    if (requiredRoomsNum && requiredRoomsNum > 0) {
        // Iterate over each hotel and check room availability
        for (const hotel of hotelsInCity) {
            let availableRooms = hotel.roomCount; // Default to total rooms if no dates provided
            
            // If dates are provided, calculate actual availability
            if (checkInDate && checkOutDate) {
                const checkInDateObj = new Date(checkInDate + 'T00:00:00.000Z');
                const checkOutDateObj = new Date(checkOutDate + 'T23:59:59.999Z');
                
                const bookedRooms = await BookingDetails.aggregate([
                    {
                        $match: {
                            hotelId: hotel._id,
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
                availableRooms = hotel.roomCount - totalRoomsBooked;
            }

            // Check if the available rooms meet the required number of rooms
            // console.log(`Hotel ${hotel.hotelName}: Total rooms: ${hotel.roomCount}, Available: ${availableRooms}, Required: ${requiredRoomsNum}, Available >= Required: ${availableRooms >= requiredRoomsNum}`);
            
            if (availableRooms >= requiredRoomsNum) {
                const { description, type, roomCount, facilities, contactNo, email, password, ...hotelData } = hotel.toObject();
                availableHotels.push({ hotelData: { ...hotelData, address: hotel.address, availableRooms } });
            }
        }
    } else {
        // If no room requirement, show all hotels
        for (const hotel of hotelsInCity) {
            const { description, type, roomCount, contactNo, email, ...hotelData } = hotel.toObject();
            availableHotels.push({ hotelData: { ...hotelData, address: hotel.address } });
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, availableHotels, "All hotels with required search condition is returned")
    );
});


// Re-add getDetailsOfHotel function
const getDetailsOfHotel = asyncHandler(async (req, res) => {
    const hotelId = req.params.hotelId;

    const hotel = await HotelDetails.findById(hotelId).select("-password")
        .populate({
            path: "ratings",
            populate: {
                path: "userId",
                select: "first_name last_name",
            },
        });

    if (!hotel) {
        throw new ApiError(400, "Hotel not found");
    }

    let averageOverallRatings = 0,
        averageServiceRatings = 0,
        averageRoomsRatings = 0,
        averageCleanlinessRatings = 0,
        averageFoodRatings = 0;

    if (hotel.ratings.length !== 0) {
        hotel.ratings.forEach((rating) => {
            averageOverallRatings += rating.overallRating;
            averageServiceRatings += rating.serviceRating;
            averageRoomsRatings += rating.roomsRating;
            averageCleanlinessRatings += rating.cleanlinessRating;
            averageFoodRatings += rating.foodRating;
        });
    }

    const totalRatings = hotel.ratings.length;
    let allAverageRatings = {};
    if (totalRatings !== 0) {
        allAverageRatings = {
            averageOverallRatings: Number(averageOverallRatings / totalRatings).toFixed(2),
            averageServiceRatings: Number(averageServiceRatings / totalRatings).toFixed(2),
            averageRoomsRatings: Number(averageRoomsRatings / totalRatings).toFixed(2),
            averageCleanlinessRatings: Number(averageCleanlinessRatings / totalRatings).toFixed(2),
            averageFoodRatings: Number(averageFoodRatings / totalRatings).toFixed(2)
        };
    } else {
        allAverageRatings = {
            averageOverallRatings: 0,
            averageServiceRatings: 0,
            averageRoomsRatings: 0,
            averageCleanlinessRatings: 0,
            averageFoodRatings: 0
        };
    }

    // User wise ratings
    let userWiseRatings = [];
    hotel.ratings.forEach((rating) => {
        const { userId, reviewTitle, reviewDescription, overallRating, serviceRating, roomsRating, cleanlinessRating, foodRating, reviewImages } = rating;
        userWiseRatings.push({
            userName: `${userId.first_name} ${userId.last_name}`,
            reviewTitle,
            reviewDescription,
            overallRating,
            reviewImages,
            serviceRating,
            roomsRating,
            cleanlinessRating,
            foodRating
        });
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { hotel, allAverageRatings, userWiseRatings }, "Hotel ratings retrieved successfully"));
});

export {
    RegisterHotel,
    handleSearchRequest,
    getDetailsOfHotel,
    getRandomHotels
}