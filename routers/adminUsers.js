import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUsers from '../models/AdminUsers.js';
import fetchuser from '../middleware/fetchuser.js';

const router = express.Router();
const JWT_SECRET = 'Shouryaisagoodb$&oy';

// ROUTE 1: Create a User using: POST "/api/auth/createAdminUsers". Doesn't require Auth
router.post('/createAdminUsers', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // check whether the user with this email exists already
        let user = await AdminUsers.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);        
        // Create a new user
        user = await AdminUsers.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        const success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Authenticate a User using: POST "/api/auth/loginAdminUsers". No login required
router.post('/loginAdminUsers', [
    body('email', 'Enter a valid & proper email').isEmail(),
    body('password', 'Password Cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await AdminUsers.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Get loggedIn User Details using: POST "/api/auth/getUser". Login required
router.post('/getUser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await AdminUsers.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
