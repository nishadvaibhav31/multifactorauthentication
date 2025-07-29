import mongoose from "mongoose";

export const ConnectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connected to mongodb ");
  } catch (err) {
    console.log(`error ${err.message}`);
  }
};
