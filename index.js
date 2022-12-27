require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const corsConfig = require("./config/cors");

const { authRouter, userRouter } = require("./routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use(errorMiddleware);

async function start() {
  try {
    mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log("Server started on ", PORT);
    });
  } catch (error) {
    console.log("Error when app starts", error);
  }
}

start();
