import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import exphbs from "express-handlebars";
import { auth } from "express-openid-connect";
import jwt from "jsonwebtoken";

import userRouter from "./routes/user.route.js";
import { findOrCreate } from "./services/user.service.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.set('trust proxy', true);

app.use(
  auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET,
    idpLogout: true,
    afterCallback: async (req, res, session) => {
      const claims = jwt.decode(session.id_token);
      await findOrCreate(claims);
      return session;
    },
  }),
);

app.use(express.static(path.resolve() + '/src/views'));
app.engine('hbs', exphbs({
  defaultLayout: path.resolve() + '/src/views/index.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve() + '/src/views');

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.use("/api/user", userRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}/api`);
});
