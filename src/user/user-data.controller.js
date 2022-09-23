import Joi from "joi";
import {v4} from "uuid";
import {customAlphabet} from "nanoid";
import {generateJwt} from "../../utils/generateJwt.js";
import {sendEmail} from "../../utils/mailer.js";
import {comparePasswords, hashPassword, User} from "../../schemas/user-schema.js";
import crypto from "crypto";

const CHARACTER_SET =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const REFERRAL_CODE_LENGTH = 8;

const referralCode = customAlphabet(CHARACTER_SET, REFERRAL_CODE_LENGTH);

export const checkUserActivation = async (req, res) => {
    const activationSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 })
    });

    const result = await activationSchema.validate(req.body);

    if (result.error) {
        return await res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }


    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            error: true,
            message: "Email empty or not valid format",
        });
    }

    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "Account not found",
        });
    }

    //2. Throw error if account is not activated
    if (!user.active) {
        console.log('Current user is not active');
        return false;
    }





}
