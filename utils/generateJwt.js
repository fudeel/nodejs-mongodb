import jwt from "jsonwebtoken";

const options = {
    expiresIn: "1h",
};

export async function generateJwt(email, userId) {
    try {
        const payload = { email: email, id: userId };
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        return { error: false, token: token };
    } catch (error) {
        return { error: true };
    }
}
