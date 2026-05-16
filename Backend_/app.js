import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: '*', 
    credentials: true               
  }));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import hotelRouter from "./routes/hotel.route.js"
import userRouter from "./routes/user.route.js";
import managerRouter from "./routes/manager.route.js";

import adminRoutes from "./routes/user.route.js";
app.use('/api/v1/admin', adminRoutes);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/manager", managerRouter);

export { app }
