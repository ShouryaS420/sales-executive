import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const projectsDeveloperSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    pic:{
        type: String,
        // required: true,
        default: "Image",
    },
    desc:{
        type: String,
        required: true,
    },
    estIn:{
        type: String,
        required: true,
    },
    totalProject:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const projectsDeveloper = mongoose.model("developer-detail", projectsDeveloperSchema);