import User from "../../DB/models/user.model.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

// post adduser

export const adduser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

// getalluser

export const getallusers = async () => {
  const user = await User.find();
  return user;
};

// get user by id

export const getuserbyid = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw createNotFoundError("user Not Found");
  }

  return user;
};

// put
export const updateuser = async (id, userData, file) => {
  if (file) {
    const result = await uploadToCloudinary(file.buffer, "Gmate/Avatars");
    userData.avatar = result.secure_url;
  }
  const user = await User.findByIdAndUpdate(id, userData, {
    new: true,
  });

  return user;
};

export const deleteuser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};
