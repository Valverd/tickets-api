import express from "express";
import { db } from "./db/db";

const app = express();
app.use(express.json());

db.connect((error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log("Connected to database");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
