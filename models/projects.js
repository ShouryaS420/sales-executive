import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ProjectSchema = new mongoose.Schema({
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
    landParcel: {
        type: String,
        required: true,
    },
    sizes: {
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
    rera: {
        type: String,
        required: true,
    },
    launchDate: {
        type: String,
        required: true,
    },
    possessionDate: {
        type: String,
        required: true,
    },
    floorPlan: {
        type: Array,
    },
    amenities: {
        type: Array,
    },
    soldOut: {
        type: Boolean,
        default: false,
    },
    publish: {
        type: Boolean,
        default: false,
    },
    newlyAdded: {
        type: Boolean,
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
}, { timestamps: true });

export const Project = mongoose.model("projects-details", ProjectSchema);