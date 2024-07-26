import express from "express";
import User from "./routers/User.js";
import Excel from "./routers/Excel.js";
import Project from "./routers/Project.js";
import Developer from "./routers/Developer.js";
import SiteVisit from "./routers/SiteVisit.js";
import LeadAssignment from "./routers/LeadAssignment.js";
import TeamRoutes from "./routers/TeamRoutes.js";
import employeeRoutes from "./routers/employeeRoutes.js";
import projectsRoute from './routers/projects.js';
import developersRoute from './routers/developers.js';
import usersRoute from './routers/users.js';
import adminUsersRoute from './routers/adminUsers.js';

import officeTimingsRoutes from './routers/officeTimingsRoutes.js';//add
import checkInRouter from './routers/checkInRouter.js';//add

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
app.use("/api/developer", Developer);
app.use("/api/SiteVisit", SiteVisit);
app.use("/api/leadAssignment", LeadAssignment);
app.use("/api/TeamRoutes", TeamRoutes);
app.use("/api/employeeRoutes", employeeRoutes);
app.use('/api/projects', projectsRoute);
app.use('/api/developers', developersRoute);
app.use('/api/user', usersRoute);
app.use('/api/auth', adminUsersRoute);

app.use('/api/officeTime', officeTimingsRoutes);//add
app.use('/api/checkIn', checkInRouter);//add
