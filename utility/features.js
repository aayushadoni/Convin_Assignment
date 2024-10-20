import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {jwtSecret} from "./config.js";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};

const connectDB = (uri) => {
    console.log("Attempting to connect to database...");
    mongoose.connect(uri)
        .then((data) => {
            console.log(`Successfully connected to the database at host: ${data.connection.host}`);
        })
        .catch((err) => {
            throw new Error(err);
        });
}

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({id: user._id}, jwtSecret);
    return res
        .status(code)
        .cookie("Convin", token, cookieOptions)
        .json({
            success: true,
            user,
            message
        });
};


export {connectDB, sendToken, cookieOptions};