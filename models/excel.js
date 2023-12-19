import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const excelSchema = new mongoose.Schema({
    excelName: {
        type: Array,
        default: 'aaa',
    },
    excelEmail: {
        type: Array,
        default: 'aaa',
    },
    excelMobile: {
        type: Array,
        default: 'aaa',
    },
    userID: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        default: 'aaa',
    },
    clientName: {
        type: String,
        // default: 'aaa',
    },
    mobile: {
        type: String,
        // default: 'aaa',
    },
    lookingFor: {
        type: String,
        // default: 'aaa',
    },
    configuration: {
        type: Array,
        // default: 'aaa',
    },
    leadType: {
        type: String,
        default: 'aaa',
    },
    uploadedDate: { type: Date, default: Date.now },
});

export const Excel = mongoose.model("Excel Data", excelSchema);