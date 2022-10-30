import mongoose from "mongoose";
import config from "./config/index";

mongoose
  .connect(config.urlDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.error(error);
  });
