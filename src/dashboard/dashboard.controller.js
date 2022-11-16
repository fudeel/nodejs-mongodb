import Joi from "joi";
import {Event} from "../../schemas/event-schema.js";
import {User} from "../../schemas/user-schema.js";


const filterSchema = Joi.object().keys({
    maxDistance: Joi.number(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
});
const userFilterSchema = Joi.object().keys({
    role: Joi.array().items(Joi.string()),
    username: Joi.string().optional()
});



export const GetUsersByFilter = async (req, res, googleIdToken) => {
    try {

        // POST validation
        const result = await userFilterSchema.validate(req.body);
        if (result.error) {
            return await res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }


        const filterBody = {}

        if (req.body.role) filterBody.role = req.body.role;
        if (req.body.username) filterBody.username = req.body.username;

        console.log('filtered body: ', filterBody);


        User.find(filterBody).select('username pic role sellingItems isCertified').exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            } else {
                res.status(500).send({error: true, message: err.message, code: err.code});
            }
        });




    } catch (err) {
        console.error("Login error try-catch", err);
    }
};


export const getEvents = async (req, res, googleIdToken) => {
    try {

        // POST validation
        const result = await filterSchema.validate(req.body);
        if (result.error) {
            return await res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }

        Event.aggregate([
            {
                $geoNear: {
                    near: {type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.longitude)]},
                    key: 'location',
                    maxDistance: parseFloat('1000')*1609,
                    distanceField: 'dist.calculated',
                    spherical: true
                }
            }
        ]).exec((err, docs) => {
            if (!err) {
                console.log('DOCS: ', docs);
                res.status(200).send(docs);
            } else {
                console.log('POISTION ERROR: ', err);
                res.status(500).send({error: true, message: err.message, code: err.code});
            }
        });




    } catch (err) {
        console.error("Login error try-catch", err);
    }
};



export const getAllCreatorsByFilter = async (req, res, googleIdToken) => {
    try {

        // POST validation
        const result = await filterSchema.validate(req.body);
        if (result.error) {
            return await res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }

        Event.aggregate([
            {
                $geoNear: {
                    near: {type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.longitude)]},
                    key: 'location',
                    maxDistance: parseFloat('1000')*1609,
                    distanceField: 'dist.calculated',
                    spherical: true
                }
            }
        ]).exec((err, docs) => {
            if (!err) {
                console.log('DOCS: ', docs);
                res.status(200).send(docs);
            } else {
                console.log('POISTION ERROR: ', err);
                res.status(500).send({error: true, message: err.message, code: err.code});
            }
        });




    } catch (err) {
        console.error("Login error try-catch", err);
    }
};
