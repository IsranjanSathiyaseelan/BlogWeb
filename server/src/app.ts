import express from "express";
import { router } from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export { app };
