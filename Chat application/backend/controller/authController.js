import userModel from "../model/userModel.js";  
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export default class AuthController {

    // Register user method
    async register(req, res) {
        try {
            const { username, fullname, email, password, gender } = req.body;

            // Normalize username (remove spaces and convert to lowercase)
            const newUserName = username.toLowerCase().replace(/ /g, '');

            // Check if username already exists
            const user_name = await userModel.findOne({ username: newUserName }); 
            if (user_name) return res.status(400).json({ message: "This username already exists" });

            // Check if email already exists
            const userEmail = await userModel.findOne({ email: email }); 
            if (userEmail) return res.status(400).json({ message: "This email is already registered" });

            // Validate password length
            if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 13); // 13 is the salt rounds for bcrypt

            const newUser = new userModel({
                username: newUserName,
                fullname,
                email,
                password: passwordHash,
                gender
            });

            // Save the user to the database
            await newUser.save();

            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    // Login method
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await userModel.findOne({ email })
                .populate("friends following", "-password");
            if (!user) return res.status(400).json({ message: "No user with that email available" });

            // Compare the password with the hashed password stored in the DB
            const isMatch =  bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            // Generate access token
            const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h' // Access token expires in 1 hour
            });

            // Generate refresh token
            // const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            //     expiresIn: '7d' // Refresh token expires in 7 days
            // });

            // Set refresh token in an HTTP-only cookie
            // res.cookie('refreshtoken', refreshToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production', // Secure flag in production
            //     path: "/api/refresh_token",
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            // });

            // Prepare the user response
            const userResponse = {
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                gender: user.gender,
                accessToken // Include the access token
            };

            return res.json(userResponse);

        } catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    // Logout method
    // async logout(req, res) {
    //     try {
    //         res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
    //         res.json({ message: "Logout successfully" });
    //     } catch (err) {
    //         res.status(400).json({ success: false, message: err.message });
    //     }
    // }

    // Generate new access token using refresh token
    // async generateAccessToken(req, res) {
    //     try {
    //         const rf_token = req.cookies.refreshtoken;

    //         if (!rf_token) {
    //             return res.status(401).json({ message: "Refresh token not provided" });
    //         }

    //         // Verify the refresh token
    //         jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    //             if (err) {
    //                 return res.status(403).json({ message: "Invalid or expired refresh token" });
    //             }

    //             // Fetch user information from the database using the decoded user ID
    //             const user = await userModel.findById(decoded.userId).select("-password")
    //                 .populate("friends following");

    //             if (!user) {
    //                 return res.status(404).json({ message: "User does not exist" });
    //             }

    //             // Generate new access token
    //             const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
    //                 expiresIn: '1h' // Access token expires in 1 hour
    //             });

    //             // Return the new access token and user info
    //             res.json({ accessToken, user });
    //         });

    //     } catch (err) {
    //         console.error(err);
    //         res.status(400).json({ success: false, message: err.message });
    //     }
    // }
}
