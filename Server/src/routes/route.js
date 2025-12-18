const express = require("express")
const router = express.Router();

const { signUpUser, getUser, loginUser, updateUser, deleteUser, otpLogin, googleLogin, getAllUser, blockUnblockUser, changePassword} = require("../controllers/userController");


//Public routes
router.post("/signup", signUpUser);


module.exports = router;