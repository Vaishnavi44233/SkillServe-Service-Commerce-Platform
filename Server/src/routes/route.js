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
router.get("/allUsers",authentication, authorization("admin"), getAllUser);
router.patch("/updateUser", authentication, updateUserProfile);

module.exports = router;