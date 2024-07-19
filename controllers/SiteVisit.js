import { SiteVisit } from "../models/siteVisit.js";

export const siteVisitForm = async (req, res) => {
  try {

    const { name, email, mobile } = req.body;
    let siteVisit = await SiteVisit.findOne({ email });
    if (siteVisit) {
      return res.status(400).json({ success: false, message: "siteVisit already exists" });
    }
    siteVisit = await SiteVisit.create({
      name,
      email,
      mobile,
    });
    res.status(500).send({ success: false, message: siteVisit });
      
  } catch (error) {
    res.status(500).send({ success: false, message: `server error: ${error.message}` });
  }
}