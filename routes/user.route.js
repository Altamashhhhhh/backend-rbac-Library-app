const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const auth = require("../middleware/auth.middleware")
const roleAuth = require("../middleware/role.middleware")

userRouter.get("/", auth , roleAuth(["creator"]) ,  async (req, res) => {
  try {
    const user = await userModel.find();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send("Error while fetching users");
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      role,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error while creating user", error });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found " });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error", err });
      }
      if (result) {
        const token = jwt.sign(
          { name: user.name, role: user.role, userId: user.id },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ message: "User logged in successfully", token });
      } else {
        return res.status(401).json({ message: "Invalid Password" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error While Login ", error });
  }
});

userRouter.delete("/delete/:id", auth  , roleAuth(["creator"]) ,  async (req, res) => {
  try {
    const  id  = req.params.id;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found " });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Error While Deleting User " });
  }
});

module.exports = userRouter;
