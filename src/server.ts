import express from "express";
import cors from 'cors'
import "dotenv/config"
import { db } from "./db/db";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', (req, res) => {
  res.json({ message: "Hello World!" })
})

db.sync().then(() => {
  console.log("Connected to database on sequelize");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
