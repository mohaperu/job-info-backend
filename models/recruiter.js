const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const recruiterSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

// add mehod which returns json web token for specified user with the payload of id

recruiterSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWTPRIVATEKEY,
        // {expiresIn:"7d"}
    );

    return token;
}

//recruiter model

const Recruiter = mongoose.model("recruiter", recruiterSchema);


const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("username"),
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = {Recruiter,validate}