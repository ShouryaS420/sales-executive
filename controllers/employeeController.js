import { Employee } from '../models/employee.js';
import { Team } from '../models/team.js';
import { User } from "../models/users.js";
import { sendMail } from "../utils/sendmail.js";

export const addEmployee = async (req, res) => {
  try {
    const { name, email, image, mobile, role, teamId } = req.body;

    const team = await Team.findById(teamId).populate('employees'); // Make sure to populate the employees

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (role === 'Team Leader' && team.employees.some(emp => emp.role === 'Team Leader')) {
      return res.status(400).json({ message: 'Team can only have one Team Leader' });
    }

    let user = await User.find({ email });

    const newEmployee = new Employee({ name, email, image, mobile, role, team: teamId });
    await newEmployee.save();

    team.employees.push(newEmployee);
    await team.save();

    const pass = Math.floor(Math.random() * 1000000);

    user = User({
        bossID: newEmployee._id,
        fullName: name,
        email,
        mobile,
        role: "Team Member",
        password: pass,
        verified: true,
    });
    await user.save();

    const message = `Successfully added team member your login credentials for sales executive is email:- ${email} & password:- ${pass}`;
    
    await sendMail(email, "Verify your account", message);

    res.status(201).json({ success: true, message: newEmployee});

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTeamMember = async (req, res) => {
  const { team } = req.params;
  try {
    const teams = await Employee.find({ team });
    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teams = await Employee.findById(id);

    res.status(200).send({ success: true, message: teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching post" });
  }
};

export const checkEmailExists = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await Employee.findOne({ email });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
