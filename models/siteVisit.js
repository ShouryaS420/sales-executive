import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const siteVisitSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        // required: true,
    },
    mobile: {
        type: Number,
        // required: true,
    },    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const SiteVisit = mongoose.model("site-visits", siteVisitSchema);