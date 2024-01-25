import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const projectSchema = new mongoose.Schema({
    builderID: {
        type: String,
        // required: true,
    },
    city: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    builderName: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    rera: {
        type: String,
        required: true,
    },
    landParcel: {
        type: String,
        required: true,
    },
    noOfTowers: {
        type: String,
        required: true,
    },
    totalUnits: {
        type: String,
        required: true,
    },
    possessionDate: {
        type: String,
        required: true,
    },
    launchDate: {
        type: String,
        required: true,
    },
    startingPrice: {
        type: String,
        required: true,
    },
    EndingPrice: {
        type: String,
        required: true,
    },
    bhk: {
        type: String,
        required: true,
    },
    projectCardImage: {
        type: String,
        required: true,
    },
    projectDetailImage: {
        type: String,
        required: true,
    },
    soldOut: {
      type: String,
      default: false,
    },
    publish: {
      type: String,
      default: false,
    },
    upcoming: {
        type: Boolean,
        default: false,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Project = mongoose.model("projects-details", projectSchema);