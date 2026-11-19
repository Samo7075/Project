import express from "express";
import { ENV } from "./config/config";
import cors from "cors";
// import { clerkMiddleware } from "@clerk/express";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import path from "path";

const app = express();

app.use(
  cors({
    origin: ENV.FRONTEND_URL || true,
  })
);
// app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

if (process.env.NODE_ENV !== "production") {
  app.get("/", (_req, res) => {
    res.json({
      message: "Welcome endpoint",
      endpoints: {
        users: "/api/users",
        products: "/api/products",
      },
    });
  });
}

if (process.env.NODE_ENV === "production") {
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath));

  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
