// server.js

import express from "express";
import cors from "cors";
import {connectDB} from "./utility/features.js";
import {clientUrl, dbUrl, envMode, PORT, printAll} from "./utility/config.js";

import { addRequestId, addMeta } from "./middleware/metaData.js";
import cookieParser from "cookie-parser";
import userRoutes from "./users/route.js"
import expenseRoutes from "./expenses/route.js"
import { getBalanceSheet } from "./expenses/controller.js";

const corsOptions = {
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};

printAll();

connectDB(dbUrl);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(addRequestId);
app.use(addMeta);

app.use("/api/users", userRoutes); // User Endpoints
app.use("/api/expenses", expenseRoutes); // Expenses Endpoints
app.get("/api/balance-sheet", getBalanceSheet); // download balance-sheet


// Not Found Handler
app.use('*', (req, res) => {
    res.status(404).json({
      meta: {
        requestId: req.locals.requestId || null,
      },
      status: 'Not Found',
      message: "This route doesn't exists!",
    });
  });
  

app.listen(PORT, () => {
    console.log(`Server running in ${envMode} mode on port ${PORT}`);
});