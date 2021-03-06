//Register Route 
const router = require('express').Router();
const { Recruiter, validate } = require('../models/recruiter');
const bcrypt = require("bcrypt");

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        //check error
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }
        //check email already exist or not
        const recruiter = await Recruiter.findOne({ email: req.body.email });
        //if exist
        if (recruiter) {
            return res.status(409).send({ message: "Recruiter with given email already exist" })
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await new Recruiter({ ...req.body, password: hashedPassword }).save();
        res.status(201).send({ message: "Recruiter created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router