import { Employee } from '../models/employee.js';
import { Team } from '../models/team.js';

export const createTeam = async (req, res) => {
    try {

      const { name, boss, wow } = req.body;
      let siteVisit = await Team.findOne({ name });
      if (siteVisit) {
        return res.status(400).json({ success: false, message: "Name already exists" });
      }
      siteVisit = await Team.create({
        name,
        boss,
        wow,
      });

      res.status(201).send({ success: true, message: siteVisit });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};

export const getTeams = async (req, res) => {
    const { boss } = req.params;
  try {
    const teams = await Team.find({ boss }).populate('employees');
    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
