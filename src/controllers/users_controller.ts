import { Request, Response } from "express";
import userModel from "../models/user_model";
import bcrypt from 'bcrypt';

const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ message: "Missing userId" });
            return;
        }

        

        const user = await userModel.findById(userId).select("-password -refreshToken");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
  

const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({ message: "Missing userId" });
      return;
    }

    const { username, profilePicture, bio } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { username, profilePicture, bio },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile2 = async (req: Request, res: Response): Promise<void> => {
  console.log("updateUserProfile2" ,req.body )
  try {
    const userId = req.body.id;
    if (!userId) {
      res.status(400).json({ message: "Missing userId" });
      return;
    }

    const { username, newPassword } = req.body;
    let updatedUser;
    if(newPassword){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updatedUser = await userModel.findByIdAndUpdate(
        { _id: userId},
        { username ,password:hashedPassword},
        { new: true, runValidators: true }
      ).select("-password -refreshToken");
        console.log("PASSWORD-updatedUser",updatedUser)
    }else{
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { username},
        { new: true, runValidators: true }
      ).select("-password -refreshToken");
    }

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({ message: "Missing userId" });
      return;
    }

    const user = await userModel
      .findById(userId)
      .select("-password -refreshToken");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error"});
}
};


export { getUserProfile, updateUserProfile, getUserById ,updateUserProfile2};