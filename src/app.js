import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";

import { authJwt } from "./strategies/jwt.strategy.js";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/api", authJwt);
app.use("/api/user", userRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}/api`);
});
