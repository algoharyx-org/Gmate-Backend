import User from "../../DB/models/user.model.js";
import { createNotFoundError ,createUnauthorizedError } from "../../utils/APIErrors.js";
import bcrypt from "bcrypt";
// post adduser

export const adduserservice = async (userData) => {
  const user = await User.create(userData);

  if(!user){
    throw createNotFoundError("user not added successfully")
  }

  return user;
};

// getalluser

export const getallusersservice = async () => {
  const user = await User.find();
  return user;
};

// get user by id

export const getuserbyidservice = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw createNotFoundError("user Not Found");
  }

  return user;
};

// put
export const updateuserservice= async (id, userData) => {
  const user = await User.findByIdAndUpdate(id, userData, {
    new: true,
  });

  if(!user){
      throw createNotFoundError("user Not found");
  }

  return user;
};

export const deleteuserservice = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if(!user){
    throw createNotFoundError("user Not found");
  }
  return user;
};
