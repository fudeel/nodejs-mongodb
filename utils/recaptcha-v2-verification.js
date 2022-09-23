import axios from "axios";
export const recaptchaV2Verification = async (recaptchaKey) => {
    console.log('AA: ', process.env.GOOGLE_RECAPTCHA_V2_SECRET_KEY);
    console.log('token: ', recaptchaKey);
    const validation = await axios
        .post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_V2_SECRET_KEY}&response=${recaptchaKey}`, {}, {})
        .then(async (res) => {
            return await res.data;
        }).catch(async (err) => {
            return await err;
    });

    return validation;
}
