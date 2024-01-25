import { Project } from "../models/projects.js";
import { sendToken } from "../utils/sendToken.js";
import { sendMail } from "../utils/sendmail.js";

export const getProjects = async (req, res) => {
    try {
        const project = await Project.find();

        res.status(200).send({ success: true, message: project });

    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const getProjectsById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        res.status(200).send({ success: true, message: project });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching post' });
    }
}

export const getProjectsDetailsInWakad = async (req, res) => {
    try {
        const projects = await Project.find({ locality: 'wakad' });

        res.status(200).json({ success: true, message: projects });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const getProjectsDetailsByUpcoming = async (req, res) => {
    try {
        const projects = await Project.find({ upcoming: true });

        res.status(200).json({ success: true, message: projects });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const getProjectsDetailsByFeatured = async (req, res) => {
    try {
        const projects = await Project.find({ featured: true });

        res.status(200).json({ success: true, message: projects });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}