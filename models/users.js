import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    bossID: {
        type: String,
        default: "bossID",
    },
    fullName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        default: "password",
    },
    email: {
        type: String,
    },
    img: {
        type: String,
        default: "image",
    },
    mobile: {
        type: String,
        default: "",
    },
    role: {
        type: String,
    },
    city: {
        type: String,
    },
    area: {
        type: String,
    },
    pin: {
        type: String,
    },
    firmName: {
        type: String,
        default: "",
    },
    rera: {
        type: String,
        default: "",
    },
    gst: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    })
}

userSchema.methods.comparePassword= async function (password) {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);