import expressAsyncHandler from "express-async-handler";
import * as userServices from "./user.service.js";
import {successResponse, createResponse} from "../../utils/APIResponse.js"

// @desc addUser
// @route post/users/
// @access private
export const addUser = expressAsyncHandler(async (req, res) => {
    const user = await userServices.addUserService(req.body);

    res.status(200).json(createResponse(user,"user created successfully")); 
});

// @desc getAllUsers
// @route Get/users
// @access private
export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const data = await userServices.getAllUsersService(req.query);

  res.status(200).json(successResponse(data, "users retrieved successfully"));
});

// @desc getUser
// @route post/users/:id
// @access private
export const getUser = expressAsyncHandler(async (req, res) => {
    const user = await userServices.getUserService(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse(user ,"successfully response")); 
  
});

// @desc updateUser
// @route put/users/:id
// @access private
export const updateUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const user = await userServices.updateUserService(id, userData);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse(user, "User updated successfully" ));
  
});

// @desc deleteUser
// @route delete/users/:id
// @access private
export const deleteUser = expressAsyncHandler(async (req, res) => {
    const user = await userServices.deleteUserService(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse("User deleted successfully"));
});

