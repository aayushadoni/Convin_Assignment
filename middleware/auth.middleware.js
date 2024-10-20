
import {jwtSecret} from "../utility/config.js";
import { Api400Error } from '../handlers/errorHandlers/customError.js';
import errorMessage from '../data/messages.json' assert { type: 'json' };
import jwt from "jsonwebtoken";

const isAuthenticated =(req, res, next) => {
    const token = req.cookies["Convin"];
    if (!token) throw new Api400Error({ message: errorMessage.authErr.invalidToken });
    const decodedData = jwt.verify(token, jwtSecret);
    req.userId = decodedData.id;
    next();
};

export {isAuthenticated};