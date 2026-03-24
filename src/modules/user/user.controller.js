import expressAsyncHandler from "express-async-handler";
import * as userServices from "./user.service.js";
import {successResponse,createResponse} from "../../utils/APIResponse.js"


// @desc addUser
// @route post/users/
// @access public
export const addUser = expressAsyncHandler(async (req, res) => {
    const user = await userServices.adduserServices(req.body);

    res.status(200).json(createResponse(user,"user created successfully")); 

    // "user created successfully", user
  
});

// @desc fetchusers
// @route Get/users/allusers
// @access public

export const Getallusers = expressAsyncHandler(async (req, res) => {
  const user = await userServices.getallusersservice();

  res.status(200).json(successResponse(user, "user retreived successfully"));

  //"user retreived successfully", user 
});

// @desc fetchuserbyid
// @route post/users/:id
// @access public

export const Getuser = expressAsyncHandler(async (req, res) => {
    const user = await userServices.getuserbyidservice(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse(user ,"successfully response")); 
  
});

// @desc updateuserdata
// @route put/users/:id
// @access public

export const Updateuser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const user = await userServices.updateuserServices(id, userData);
    // .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse(user, "User updated" ));
    //message: "User updated", user
  
});

// @desc deleteuserdata
// @route delete/users/:id
// @access public
export const deleteuser = expressAsyncHandler(async (req, res) => {
    const user = await userServices.deleteuserServices(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse("User deleted successfully"));
});

