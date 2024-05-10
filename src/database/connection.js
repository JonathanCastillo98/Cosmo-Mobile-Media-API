import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI = process.env.DB_URI;
// const DB_URI = 'mongodb+srv://protostarwebdev1:QlsuG1pl7CCDN4xD@cosmo-testdb.3rsj7lj.mongodb.net/';

const connectDb = () => {
  return mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDb;
