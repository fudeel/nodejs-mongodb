import axios from "axios";

export const recaptchaVerification = async (recaptchaKey: string | string[] | undefined, version: 'v2' | 'v3') => {
    return await axios
        .post(`https://www.google.com/recaptcha/api/siteverify?secret=${version === 'v2' ? 
            process.env.GOOGLE_RECAPTCHA_V2_SECRET_KEY : process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY}&response=${recaptchaKey}`, {}, {})
        .then(async (res) => {
            return await res.data;
        }).catch(async (err) => {
            return await err;
        });
}
