const Joi = require("joi");
require("dotenv").config();
const playerAvailabilityModel = require("./player-availability.model");
const MongoClient = require('mongoose').MongoClient;


//Validate user schema
const playerAvailabilitySchema = Joi.object().keys({
    userId: Joi.string().valid().required(),
    phone_number: Joi.string().valid().required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    max_lat: Joi.string().valid().required(),
    max_lng: Joi.string().valid().required(),
    user_rank: Joi.string().valid().required(),
});

exports.AddPlayerToWaitingList = async (req, res) => {
    console.log('req: ', req.body);
    try {
        const result = playerAvailabilitySchema.validate(req.body);
        if (result.error) {
            console.log(result.error.message);
            return res.json({
                error: true,
                status: 400,
                message: result.error.message,
            });
        }

        let  addUserToWaitingList = false;

        //Check if the email has been already registered for the selected date.
        const user = await playerAvailabilityModel.findOne({
            $and: [{
                email: result.value.email,
                userId: result.value.userId
            }]
        });

        if (user) {
            console.log('Oops, you are already registered: ', user);
            return res.json({
                error: true,
                message: "You are already registered for this date",
            });
        } else {
            console.log('User can register for the selected date');
            addUserToWaitingList = true;
        }

        if (addUserToWaitingList) {
            console.log("--> Adding user to waiting list");
            const userOnWaitingList = new playerAvailabilityModel(req.body);
            userOnWaitingList.save(() => {
                console.log('saved');
            });


        }

        return res.status(200).json({
            success: true,
            message: "Registration for the selected date completed. Success",
        });
    } catch (error) {
        console.error("match registration error: ", error);
        return res.status(500).json({
            error: true,
            message: "Cannot Register for the selected date",
        });
    }
};
