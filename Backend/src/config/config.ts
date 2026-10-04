import dotenv from "dotenv"


dotenv.config()

export const ENV ={
PORT:process.env.PORT ,
FRONTEND_URL:process.env.FRONTEND_URL,
CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY
}