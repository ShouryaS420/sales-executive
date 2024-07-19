import { Project } from "../models/projects.js";
import { projectsDeveloper } from "../models/projectsDeveloper.js";
import { sendToken } from "../utils/sendToken.js";
import { sendMail } from "../utils/sendmail.js";

export const getProjectsDeveloperById = async (req, res) => {
  try {
    const { builderID } = req.params;
    const result = await projectsDeveloper.findById(builderID);

    res.status(200).send({ success: true, message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching post" });
  }
};