import {Request, Response} from "express";
import {User} from "../../schemas/user-schema";
import {CustomResponse} from "../../models/CustomResponse";

export const getCurrentUserInfo = async (req: any, res: Response) => {
    console.log('> getting user info')
    try {
        if (req.headers['accesstoken'] !== null && req.headers['accesstoken'] !== '') {
            try {
                const accesstoken: string = req.headers['accesstoken'].split(" ")[1];
                await User.find({accesstoken}).select('username firstname lastname phone email pic role sellingItems isCertified userMustInsertShippingAddress address socialNetwork becomeSellerRequest').exec((err, docs) => {

                    if (!err) {

                        if (docs.length === 0) {
                            res.status(401).send({
                                error: true,
                                message: 'Session expired or there is another error with your account',
                                status: 401,
                                forceLogout: true
                            });
                        } else {
                            console.log('> user info downloaded successfully')
                            res.status(200).send(docs[0]);
                        }

                    } else if (err){
                        throw<CustomResponse>{
                            error: true,
                            message: "Account already activated",
                            status: 500,
                        }
                    }
                });

            } catch (error: any) {
                res.status(error.status).send(error);
            }
        } else {
            console.log('X token is not in header')
            res.status(500).send({
                error: true,
                message: 'accesstoken code invalid or missing',
                code: 500
            })
        }
    } catch (error: any) {
        res.status(error.status).send(error);
    }

}