import Joi from "joi";

export interface RegisterModel {
    email?: string,
    password?: string,
    confirmPassword?: string,
    username?: string,
    recaptchaKey?: string,
    version?: string,
    referrer?: string
}