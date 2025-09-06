import express from "express";
import cors from "cors";
import bookRoutes from "./routes/book.routes";
import borrowRoutes from "./routes/borrow.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// error handler (must be last)
app.use(errorMiddleware);

export default app;
