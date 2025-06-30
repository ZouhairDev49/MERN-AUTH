
import userModel from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId); // Use req.userId from middleware
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
