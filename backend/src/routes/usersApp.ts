import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import UsersApp, { IUser } from "../models/usersApp";

const router = express.Router();

// Endpoint to add user information to the database
router.post(
  "/usersInfo",
  [
    body("name").isString().withMessage("Name must be a string"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("phone").isString().withMessage("Phone must be a string"),
    body("img").optional().isString().withMessage("Image path must be a string"), // img optional
    body("type").isString().withMessage("Type must be a string"), // Add validation for type
  ],
  async (req: Request, res: Response) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, img, type } = req.body; // Include type

    try {
      // Check if user already exists
      const existingUser: IUser | null = await UsersApp.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: "User with the same email or phone already exists" });
      }

      // Create a new user with MongoDB generating the _id automatically
      const newUser: IUser = new UsersApp({ name, email, phone, img, type }); // Include type
      await newUser.save();

      res.status(201).json({ message: "User information added successfully", user: newUser });
    } catch (error) {
      // Check the type of the error
      if (error instanceof Error) {
        res.status(500).json({ message: "Server error", error: error.message });
      } else {
        res.status(500).json({ message: "Server error", error: "Unknown error occurred" });
      }
    }
  }
);

// Endpoint to get and check user in the database
router.get("/userInfo/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await UsersApp.findOne({ $or: [{ _id: userId }, { email: userId }, { phone: userId }] });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint to update account info
router.put(
  "/userInfo/update/:userId",
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("img").optional().isString().withMessage("Image path must be a string"),
    body("type").optional().isString().withMessage("Type must be a string"), // Add validation for type
  ],
  async (req: Request, res: Response) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, img, type } = req.body; // Include type
    const userId = req.params.userId;

    try {
      // Find user by ID, email, or phone
      const user: IUser | null = await UsersApp.findOne({ $or: [{ _id: userId }, { email: userId }, { phone: userId }] });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user information
      if (name) user.name = name;
      if (img) user.img = img;
      if (type) user.type = type; // Update type if provided

      await user.save();

      res.status(200).json({ message: "User information updated successfully", user });
    } catch (error) {
      // Check the type of the error
      if (error instanceof Error) {
        res.status(500).json({ message: "Server error", error: error.message });
      } else {
        res.status(500).json({ message: "Server error", error: "Unknown error occurred" });
      }
    }
  }
);

// Endpoint to get user ID
router.get('/userInfo/userId/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UsersApp.findOne({ email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
