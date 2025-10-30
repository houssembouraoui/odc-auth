import express from "express";
import dotenv from "dotenv";
import { app } from "./app";
import { errorMiddleware } from "../middleware/error.middleware";
dotenv.config();

const PORT = process.env.PORT || 4000;

const server = express();
server.use(app);
server.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`ODC Auth server running on :${PORT}`);
});
