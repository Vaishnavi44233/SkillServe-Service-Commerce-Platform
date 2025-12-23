const mongoose = require("mongoose");
const providerModel = require("../models/providerModel");
const userModel = require("../models/userModel");

const {isvalid} = require("../utils/validator");


//Apply As Provider
const applyAsProvider = async (req, res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server Error", error});
    }
}


module.exports = {applyAsProvider}