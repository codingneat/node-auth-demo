import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

import { ensureAuthenticated } from "./strategies/github.strategy.js";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(session(
  {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
    resave: false,
    saveUninitialized: false,
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/api", ensureAuthenticated);
app.use("/api/user", userRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}/api`);
});
