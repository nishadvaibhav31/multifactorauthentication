import express from "express";
import dotenv from "dotenv";
import { ConnectToMongoDb } from "./connection/ConnectDb.js";
import authroute from "./routes/authroute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { tokenverification } from "./middleware/verifytoken.js";
import emailroute from "./routes/emailroute.js"
dotenv.config();

const app = express();
const PORT=process.env.PORT||3000;
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "https://multifactorauthentication-frontend.onrender.com",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 


app.get("/api/verifytoken", tokenverification, (req, res) => {
  res.status(201).json({ message: "token verified", user:req.user });
});
app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});
app.use("/api/",authroute);
app.use("/api/",emailroute)

app.listen(PORT, () => {
  ConnectToMongoDb();

  console.log(`App is listening on port ${PORT}`);
});
