import { Excel } from "../models/excel.js";
import { sendToken } from "../utils/sendToken.js";
import { sendMail } from "../utils/sendMail.js";

export const excelData = async (req, res) => {
    try {
        const { userID, userName, excelName, excelEmail, excelMobile, leadType } = req.body;
        // for (const excelName of excelName) {
            await Excel.create({ userID, userName, excelName: excelName, excelEmail: excelEmail, excelMobile: excelMobile, leadType: leadType });
            // await ProjectsAmenities.create({ value, id });
        // }
        res.status(201).json({ success: true, message: 'Excel data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const uploadSingleLeadData = async (req, res) => {
    try {
        const { clientName, mobile, lookingFor, configuration, userID, userName, leadType } = req.body;
        await Excel.create({ clientName, mobile, lookingFor, configuration, userID, userName, leadType });
        res.status(201).json({ success: true, message: 'Excel data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getExcelData = async (req, res) => {
    try {
        const { userID } = req.params;
        const allExcelData = await Excel.find({ userID }).sort({ uploadedDate: -1 }).exec();
        res.status(200).json({ success: true, data: allExcelData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getLeadsByTodayUploaded = async (req, res) => {
    try {
        const { userID } = req.params;
        // Get the current date and time
        const now = new Date();

        // Calculate the date and time 24 hours ago
        // const yesterday = new Date(now);
        // yesterday.setHours(now.getHours() - 24);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Query leads created in the last 24 hours
        const todaysLeads = await Excel.find({
            userID: userID,
            uploadedDate: { $gte: today }
        });

        if (!todaysLeads) {
            res.status(500).json({ success: true, message: 'today added leads not found' });
        }

        res.json(todaysLeads);

    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getLeadsByYesterdayUploaded = async (req, res) => {
    try {
        const { userID } = req.params;
        // Get the current date and time
        const now = new Date();

        // Calculate the date and time for yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // Calculate the date and time for today
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        // Query leads created between yesterday and today
        const yesterdayLeads = await Excel.find({
            userID: userID,
            uploadedDate: { $gte: yesterday, $lt: today }
        });

        res.json(yesterdayLeads);

    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
