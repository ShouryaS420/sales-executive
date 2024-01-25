import express from "express";
import User from "./routers/User.js";
import Excel from "./routers/Excel.js";
import Project from "./routers/Project.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/user", User);
app.use("/api/excel", Excel);
app.use("/api/project", Project);