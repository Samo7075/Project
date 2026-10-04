import express from "express";
import { ENV } from "./config/config";
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express' 

const app = express();

app.use(cors({origin:ENV.FRONTEND_URL}))
app.use(clerkMiddleware())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.json({
    message: "Welcome endpoint",
    endpoints: {
      users: "/api/users"
    }
  });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});