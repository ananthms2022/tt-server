
const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Trip = require("./models/Trip");

const { check, validationResult } = require('express-validator');


dotenv.config();

app.use(express.json())

app.use(cors(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

mongoose.connect(process.env.MONGO_URL)
    .then(console.log("connected to mongo"))
    .catch(err => console.log(err));

app.post("/trip/create",
    [
        check('name', 'Name should be 3 to 16 characters in length and cannot include any special characters')
            .not()
            .isEmpty()
            .isLength({ min: 3, max: 16 })
            .matches('^[A-Za-z0-9]{3,16}$'),
        check('email', 'Email is required')
            .isEmail()
            .custom(async value => {
                let emailCheck = await Trip.findOne({ 'email': value });
                if (emailCheck !== null) {
                    return Promise.reject();
                }
            }).withMessage('Email is already in use.'),
        check('location', 'Location should be one of these: India, Africe, Europe')
            .custom(val => {
                let locationCheck = ["africa", "india", "europe"].includes(val.toLowerCase());
                if (locationCheck) {
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            }),
        check('headCount', "Number of traveller should be between 1 and 10")
            .isInt({ min: 1, max: 10 }),
        check('budget', "Budget should be between 100 and 10000")
            .isInt({ min: 100, max: 10000 }),
    ], async (req, res) => {
        let errors = validationResult(req).array();
        if (errors.length) {
            res.status(400).json(errors);
            return;
        }
        const { name, email, location, headCount, budget } = req.body;
        try {
            const newTrip = new Trip({
                name, email, location, headCount, budget,
            })
            let error = newTrip.validateSync();
            console.log(error);
            const trip = await newTrip.save();
            res.status(200).json(trip);
            // res.status(200).json("success");

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    })

app.get("/trips", async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.listen("5000", () => {
    console.log("backend is runnning");
})