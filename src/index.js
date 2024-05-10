// Entry point of the API

import Express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import connectDb from "./database/connection.js";
import dotenv from "dotenv";

dotenv.config();

const app = Express();
const PORT = process.env.PORT || 3000;

// Enable this just when the frontend is ready to get data from this API
//Cors updated
const corsOptions = {
  origin: [
    "https://cosmo-three.vercel.app",
    "http://localhost:3001",
    "http://82.180.131.1",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.get("/", (req, res, next) => {
  res.status(200).json("Cosmo API working properly");
});

app.use(Express.static("blog-images"));
app.use("/api/v1", mainRouter);

const main = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await connectDb();
    console.log("db connection succeeded");
  } catch (error) {
    console.log(error);
  }
};

main();

export default app;
