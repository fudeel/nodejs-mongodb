import {Request, Response} from "express";
import {User} from "../../schemas/user-schema";

export const getCurrentUserInfo = async (req: Request, res: Response) => {
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            if (req.headers['authorization']) {
                const accessToken = req.headers['authorization'].slice(7);
                await User.find({accessToken}).select('username pic role sellingItems isCertified').exec((err, docs) => {
                    if (!err) {
                        res.status(200).send(docs);
                    } else {
                        res.status(500).send({error: true, message: err.message, code: 500});
                    }
                });
            }

        } catch (error: any) {
            console.log('ERROR in generate user info: ', error);
        }
    } else {
        console.log('Error in generate user info: Authorization code not valid or undefined');
        res.status(500).send({
            error: true,
            message: 'Authorization code invalid or missing',
            code: 500
        })
    }
}