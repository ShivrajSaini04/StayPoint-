const express = require("express");
const { required } = require("joi");
const { Schema, default: mongoose } = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email :{
        type : String,
        required : true,
    },
});

userSchema.plugin(passportlocalmongoose);

module.exports =  mongoose.model("User" , userSchema);
