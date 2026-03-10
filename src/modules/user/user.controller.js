import expressAsyncHandler from "express-async-handler";
import * as Userservice from "./user.service.js";
import {successResponse,createResponse , notfoundResponse} from "../../utils/APIResponse.js"


// @desc adduser
// @route post/users/
// @access public
export const addUser = expressAsyncHandler(async (req, res) => {
    const user = await Userservice.adduserservice(req.body);

    res.status(200).json(successResponse(user,"user created successfully")); 

    // "user created successfully", user
  
});

// @desc fetchusers
// @route Get/users/allusers
// @access public

export const Getallusers = expressAsyncHandler(async (req, res) => {
  const user = await Userservice.getallusersservice();

  res.status(200).json(successResponse(user, "user retreived successfully"));

  //"user retreived successfully", user 
});

// @desc fetchuserbyid
// @route post/users/:id
// @access public

export const Getuser = expressAsyncHandler(async (req, res) => {
    const user = await Userservice.getuserbyidservice(req.params.id);

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
    const user = await Userservice.updateuserservice(id, userData);
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
    const user = await Userservice.deleteuserservice(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(successResponse("User deleted successfully"));

    //"User deleted successfully"
 
});

