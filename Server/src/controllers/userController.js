const userModel = require("../models/userModel");

const {isValid, 
  isValidName,
  isValidEmail,
  isValidContact,
  isValidPassword,} = require("../utils/validator");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



//Signup User(manual)
const signUpUser = async (req, res) => {
    try {
      let userData = req.body;

      if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
      }

    let { name, email, phone , password, role, authProvider} = userData;

    // Auth Provider
    if(!isValid(authProvider)){
      return res.status(400).json({ msg: "auth Provider is required" });
    }

    if(!["google", "phone", "manual"].includes(authProvider)){
      return res.status(400).json({msg : "Invalid Auth Provider"});
    }

    if(authProvider !== "manual"){
      return res.status(400).json({msg: "Use Respective login API for google or OTP Authentication"})
    }

    if(authProvider == "manual"){

      //Name Validation
      if (!isValid(name)) {
        return res.status(400).json({ msg: "Name is required" });
      }
      if (!isValidName(name)) {
        return res.status(400).json({ msg: "Invalid Name" });
      }
  
      //Email Validation
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is required" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
  
      let duplicateEmail = await userModel.findOne({ email });
      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email is already Exit" });
      }
  
      //Phone Validation
      if (!isValid(phone)) {
        return res.status(400).json({ msg: "Phone Number is required" });
      }
      if (!isValidContact(phone)) {
        return res.status(400).json({ msg: "Invalid Phone Number" });
      }
  
      let duplicatePhone = await userModel.findOne({ phone });
      if (duplicatePhone) {
        return res.status(400).json({ msg: "Phone number is already Exit" });
      }
  
  
      //Password Validation
      if (!isValid(password)) {
        return res.status(400).json({ msg: "password is required" });
      }
  
      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid password" });
      }
  
      let hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
  
      
    }

    role = "user";

    let createUser = await userModel.create(userData);
    return res.status(201).json({ msg: "User signed up successfully", data: createUser });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
};


//Login User(manual)
const loginUser = async (req, res) => {
  try {
    let data = req.body;

    //Validation
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let { email, password, authProvider } = data;

    if(!isValid(authProvider)){
      return res.status(400).json({msg : "Auth Provider is required"});
    }

    if(authProvider !== "manual"){
      return res.status(400).json({msg : "Use respective login API for google or OTP Auhtentication"});
    }

    if (!isValid(email) || !isValidEmail(email)) {
      return res.status(400).json({ msg: "Email is required" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "password is required" });
    }

    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if(user.authProvider !== "manual"){
      return res.status(400).json({msg: `This Email Registered using ${user.authProvider} login`})
    }

    let isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
};


// OTP login
const otpLogin = async (req, res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}

// google Login
const googleLogin = async (req, res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    let id = req.userId;
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "add Request ! No data Provided." });
    }

    let { name, email, phone} = userData;
    if (name !== undefined) {
      if (!isValid(name)) {
        return res.status(400).json({ msg: "Name is required" });
      }
      if (!isValidName(name)) {
        return res.status(400).json({ msg: "Invalid Name" });
      }
    }

    if (email !== undefined) {
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is required" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
      let duplicateEmail = await userModel.findOne({ email });
      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email is already Exit" });
      }
    }

    if (phone !== undefined) {
      if (!isValid(phone)) {
        return res.status(400).json({ msg: "Phone Number is required" });
      }
      if (!isValidContact(phone)) {
        return res.status(400).json({ msg: "Invalid Phone Number" });
      }
      let duplicatePhone = await userModel.findOne({ phone });
      if (duplicatePhone) {
        return res.status(400).json({ msg: "Phone number is already Exit" });
      }
    }

    // if (password !== undefined) {
    //   if (!isValid(password)) {
    //     return res.status(400).json({ msg: "password is required" });
    //   }
    //   if (!isValidPassword(password)) {
    //     return res.status(400).json({ msg: "Invalid password" });
    //   }

    //   userData.password = await bcrypt.hash(password, 10);
    // }


    let update = await userModel.findByIdAndUpdate(id, userData, { new: true });
    if (!update) {
      return res.status(404).json({ msg: "User Not found" });
    }

    return res.status(200).json({ msg: "user updated successfully", data: update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error});
  }
};


// Delete user Profile
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;

    let deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User Not found" });
    }

    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error});
  }
};

//Get User Profile
const getUserProfile = async (req, res) => {
  try {
    let userId = req.userId;

    if (!userId) {
      return res.status(400).json({ msg: "User Id is required" });
    }

    let user = await userModel.findById(userId).select("-password")

    if(!user){
      return res.status(404).json({msg : "user Not Found"})
    }

    return res.status(200).json({ msg: "User Profile Fetched Successfully", data: user});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
};


// Get all Users (Admin, Provider)
const getAllUser = async (req, res)=>{
  try {
    if(req.userRole !== "admin"){
      return res.status(403).json({msg: "Access Denied! Admins Only"});

    }

    let users = await userModel.find().select("-password").sort({createdAt: -1});

    if(!users || users.length === 0){
      return res.status(404).json({msg: "No users Found"});
    }

    return res.status(200).json({msg: "Users Fetched Successfully", totalUsers: users.length, data: users,});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}

// Block Unblock User(Admin)
const blockUnblockUser = async (req, res)=>{
  try {
    let userId = req.params.userId;
    let {isBlocked} = req.body;

    // if(mongoose.Types.ObjectId.isValid(userId)){
    //   return res.status(400).json({msg: "Invalid User Id"})
    // }

    if(typeof isBlocked !== "boolean"){
      return res.status(400).json({msg : "IsBlocked Must be a boolean value"})
    }

    let user = await userModel.findById(userId);
    if(!user){
      return res.status(400).json({mag: "User Not Found"})
    }
    
    if(user.role === "admin"){
      return res.status(403).json({msg : "Admin cannot be blocked"})
    }

    user.isBlocked = isBlocked;

    await user.save();

    return res.status(200).json({msg : `user ${isBlocked ? "Blocked" : "UnBlocked"} Successfully`});



  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}


//Change Password
const changePassword = async (req, res)=>{
  try {
    let userId = req.userId;

    let {oldPassword, newPassword} = req.body;

    if(!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({msg : "Bad Request ! No data Provided."});
    }

    
    if(!isValid(oldPassword)){
      return res.status(400).json({msg : "Old Password is required"});
    }

    if(!isValid(newPassword)){
      return res.status(400).json({msg : "New Password is required"});
    }

    if(!isValidPassword(newPassword)){
      return res.status(400).json({msg : "Invalid New Password"});
    }

    let user = await userModel.findById(userId).select("+password");
    if(!user){
      return res.status(404).json({msg : "User Not Found"});
    }

    if(user.authProvider !== "manual"){
      return res.status(400).json({msg : "password change allowed only for manual login users"});
    }

    let passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if(!passwordMatch){
      return res.status(401).json({msg: "Old Password is Incorrect"});
    }

    let hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    return res.status(200).json({msg : "Passsword Changed Successfully"});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}





module.exports = {
  signUpUser,
  loginUser,
  updateUserProfile,
  deleteUser,
  getUserProfile,
  getAllUser,
  otpLogin,
  googleLogin,
  blockUnblockUser,
  changePassword,
};
