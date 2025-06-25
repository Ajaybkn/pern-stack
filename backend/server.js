import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(helmet()); // Helmet is a security middleware that helps you protect your app by setting various HTTP headers.
app.use(morgan("dev")); // log the requests.

//apply arcjet rate limit to all routes-->>

app.use((req, res, next) => {
  try {
    const decision = aj.protect(req, {
      requested: 1, //specifies that each request consumes 1 token
    });
    if (decision.isBlocked) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too Many Requests",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          error: "Bot Access Denied",
        });
      } else {
        res.status(403).json({
          error: "Forbidden",
        });
      }
      return;
    }
    //check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({
        error: "Spoofed Bot Detected",
      });
      return;
    }
    next();
  } catch (error) {
    console.log(("ArcJet Error:", error));
    next(error);
  }
});

app.use("/api/products", productRoutes);
async function initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      price NUMERIC(10, 2) NOT NULL,
      created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    console.log("DB initialized successfully");
  } catch (error) {
    console.error("Error initDB:", error);
  }
}
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Up & Running on port - ${PORT}`);
  });
});
