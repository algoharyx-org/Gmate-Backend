import User from "../../DB/models/user.model.js";
import { createNotFoundError ,createUnauthorizedError } from "../../utils/APIErrors.js";
import Features from "../../utils/features.js";

export const addUserService = async (userData) => {
  const user = await User.create(userData);

  return user;
};

export const getAllUsersService = async (query) => {
  const userCount = await User.countDocuments();
  const feature = new Features(User.find(), query)
    .filter()
    .sort()
    .limitFields()
    .search("user")
    .pagination(userCount);
  const users = await feature.mongooseQuery;
  return {users, length: userCount, metadata: feature.paginationResult};
};

export const getUserService = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw createNotFoundError("user Not Found");
  }

  return user;
};

export const updateUserService= async (id, userData) => {
  const user = await User.findByIdAndUpdate(id, userData, {
    new: true,
  });

  if(!user){
      throw createNotFoundError("user Not found");
  }

  return user;
};

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if(!user){
    throw createNotFoundError("user Not found");
  }
  return user;
};
