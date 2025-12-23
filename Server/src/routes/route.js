const express = require("express")
const router = express.Router();

const { signUpUser, loginUser, updateUserProfile, deleteUser, otpLogin, googleLogin, getAllUser, blockUnblockUser, changePassword, getUserProfile} = require("../controllers/userController");

const authentication = require("../middlewares/authMiddleware");
let authorization = require("../middlewares/authorization")

//Public routes
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/profile",authentication, getUserProfile);

router.delete("/deleteUser", authentication, deleteUser);

// Get All Profiles (Admin)
router.get("/allUsers",authentication, authorization("admin"), getAllUser);

// User delete itself
router.patch("/updateUser", authentication, updateUserProfile);

// admin delete user
router.delete("/user/:userId", authentication, authorization("admin"), deleteUser);

//Block Unblock User (Admin)
router.put("/user/block/:userId", authentication, authorization("admin"), blockUnblockUser);

// Password Change (user)
router.put("/changePassword", authentication, changePassword);


module.exports = router;