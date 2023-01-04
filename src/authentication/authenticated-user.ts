import {Request, Response} from "express";
import {User} from "../../schemas/user-schema";
import {CustomResponse} from "../../models/CustomResponse";

export const getCurrentUserInfo = async (req: Request, res: Response) => {
    console.log('>  getting current user information');
    try {
        if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
            try {
                if (req.headers['authorization']) {
                    const accessToken = req.headers['authorization'].slice(7);
                    await User.find({accessToken}).select('username firstname lastname phone email pic role sellingItems isCertified basicInfoAvailableToChange userMustInsertShippingAddress address').exec((err, docs) => {
                        if (!err) {
                            res.status(200).send(docs);
                        } else {
                            throw<CustomResponse>{
                                error: true,
                                message: "Account already activated",
                                status: 500,
                            }
                        }
                    });
                }

            } catch (error: any) {
                console.log('ERROR in generate user info: ', error);
                res.status(error.status).send(error);
            }
        } else {
            console.log('Error in generate user info: Authorization code not valid or undefined');
            throw<CustomResponse> {
                error: true,
                message: 'Authorization code invalid or missing',
                code: 500
            }
        }
    } catch (error: any) {
        res.status(error.status).send(error);
    }

}