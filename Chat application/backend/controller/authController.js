import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class AuthController {
  // Register user method
  async register(req, res) {
    try {
      const { username, fullname, email, password, gender } = req.body;

      // Normalize username (remove spaces and convert to lowercase)
      const newUserName = username.toLowerCase().replace(/ /g, "");

      // Check if username already exists
      const user_name = await userModel.findOne({ username: newUserName });
      if (user_name)
        return res
          .status(400)
          .json({ message: "This username already exists" });

      // Check if email already exists
      const userEmail = await userModel.findOne({ email: email });
      if (userEmail)
        return res
          .status(400)
          .json({ message: "This email is already registered" });

      // Validate password length
      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 13); // 13 is the salt rounds for bcrypt

      const newUser = new userModel({
        username: newUserName,
        fullname,
        email,
        password: passwordHash,
        gender,
      });

      // Save the user to the database
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
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
      const user = await userModel
        .findOne({ email })
        .populate("friends following", "-password");
      if (!user)
        return res
          .status(400)
          .json({ message: "No user with that email available" });

      // Compare the password with the hashed password stored in the DB
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      // Generate access token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h", // Access token expires in 1 hour
        }
      );

      const userResponse = {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
        accessToken, // Include the access token
      };

      return res.json(userResponse);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  async userList(req, res) {
    try {
      const users = await userModel.find({}, "fullname _id");
      if (users) {
        res.status(200).json({
          sucess: true,
          users,
        });
      } else {
        res.send({ success: false, message: "Cannot find users" });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async findUser(req, res) {
    const { userId } = req.body;

    try {
      // Find the user by ID and select specific fields
      const user = await userModel.findById(userId, "username fullname");

      if (user) {
        return res.status(200).json({ success: true, user });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } catch (error) {
      // Log the error and return an error response
      console.error("Error finding user:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
