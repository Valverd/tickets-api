import express from "express";
import cors from 'cors'
import "dotenv/config"
import { db } from "./db/db";
import user_route from './routes/user_route'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', user_route)

db.sync().then(() => {
  console.log("Connected to database on sequelize");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});