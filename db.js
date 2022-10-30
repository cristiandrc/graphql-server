import mongoose from "mongoose";
import { config } from "./config";

mongoose
  .connect(config.urlDb, {
    useNewUrlParcel: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.error(error);
  });
