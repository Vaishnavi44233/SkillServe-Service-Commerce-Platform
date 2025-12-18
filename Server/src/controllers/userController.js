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
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let { email, password } = data;
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is required" });
    }
    if (!isValid(password)) {
      return res.status(400).json({ msg: "password is required" });
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
      },
      "SkillServe",
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
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "ad Request ! No data Provided." });
    }

    let { name, email, contactNo, password } = userData;
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

    if (contactNo !== undefined) {
      if (!isValid(contactNo)) {
        return res.status(400).json({ msg: "Contact Number is required" });
      }
      if (!isValidContact(contactNo)) {
        return res.status(400).json({ msg: "Invalid Contact Number" });
      }
      let duplicateContact = await userModel.findOne({ contactNo });
      if (duplicateContact) {
        return res.status(400).json({ msg: "Contact number is already Exit" });
      }
    }

    if (password !== undefined) {
      if (!isValid(password)) {
        return res.status(400).json({ msg: "password is required" });
      }
      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid password" });
      }

      userData.password = await bcrypt.hash(password, salt);
    }


    let update = await userModel.findByIdAndUpdate(id, userdata, { new: true });
    if (!update) {
      return res.status(404).json({ msg: "User Not found" });
    }

    return res.status(200).json({ msg: "user updated successfully", update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error});
  }
};


// Delete user Profile
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

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
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    let userData = await userModel.findById(id);
    if (!userData) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    return res.status(200).json({ data: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
};


// Get all Users (Admin, Provider)
const getAllUser = async (req, res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}

// Block Unblock User(Admin)
const blockUnblockUser = async (req, res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error});
  }
}


//Change Password
const changePassword = async (req, res)=>{
  try {
    
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
