import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { nullifyFalsyValues } from "./utils/object.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;

// Route Imports
import routes from "./routes/_routes.js";
const {
  assetRouter,
  authRouter,
  brandRouter,
  cartRouter,
  categoryRouter,
  orderRouter,
  productRouter,
  reviewRouter,
  transactionRouter,
  userRouter,
  wishlistRouter,
  sessionRouter,
} = routes;

// Configuration
app.set("view engine", "ejs");

// Request whitelist
const whitelist = ["http://localhost:3000", "http://localhost:3001"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, _, next) => {
  // Set a locals object to pass data among middlewares
  req.locals = {};

  if (req.body) {
    nullifyFalsyValues(req.body);
  }
  next();
});

// Routes
app.use("/assets", assetRouter);
app.use("/auth", authRouter);
app.use("/brands", brandRouter);
app.use("/carts", cartRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
app.use("/products", productRouter);
app.use("/reviews", reviewRouter);
app.use("/sessions", sessionRouter);
app.use("/transactions", transactionRouter);
app.use("/users", userRouter);
app.use("/wishlists", wishlistRouter);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.ouqxf.mongodb.net/?retryWrites=true&w=majority`
);

const connection = mongoose.connection;

connection.on("open", () => {
  console.log("MongoDB connection established");
});

connection.on("error", (e) => {
  console.log("MongoDB connection error: ", e.message);
});

app.listen(PORT, (e) => {
  const message = e ? e.message : `Server listening on port  ${PORT}`;
  console.log(message);
})
