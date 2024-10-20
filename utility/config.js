// utils/constants.js
import dotenv from "dotenv";

dotenv.config();

const envMode = process.env.NODE_ENV || "PRODUCTION";
const dbUrl = process.env.MONGO_URI;
const clientUrl = process.env.CLIENT_URL;
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT;


const printAll = () => {
    console.log({
        "EnvMode": envMode,
        "dbUrl": dbUrl,
        "clientUrl": clientUrl,
        jwtSecret,
        PORT
    })
}

export {envMode, dbUrl, clientUrl, jwtSecret, PORT, printAll};