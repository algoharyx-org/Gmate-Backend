import * as Userservice from "./user.service.js";

// @desc adduser
// @route post/users/
// @access public
export const addUser = async (req, res) => {
  try {
    const user = await Userservice.adduser(req.body);

    res.status(201).json({ message: "user created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc fetchusers
// @route Get/users/allusers
// @access public

export const Getallusers = async (req, res) => {
  const user = await Userservice.getallusers();

  res.status(200).json({ message: "user retreived successfully", user });
};

// @desc fetchuserbyid
// @route post/users/:id
// @access public

export const Getuser = async (req, res) => {
  try {
    const user = await Userservice.getuserbyid(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetch successfullly", user });
  } catch (error) {
    res.status(500).json("server error");
  }
};

// @desc updateuserdata
// @route put/users/:id
// @access public

export const Updateuser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const user = await Userservice.updateuser(id, userData);
    // .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc deleteuserdata
// @route delete/users/:id
// @access public

export const deleteuser = async (req, res) => {
  try {
    const user = await Userservice.deleteuser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
