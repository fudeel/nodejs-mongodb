import Joi from "joi";
import {Event} from "../../schemas/event-schema.js";

const filterSchema = Joi.object().keys({
    maxDistance: Joi.number(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
});

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
