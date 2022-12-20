import jwt from "jsonwebtoken";

const options = {
    expiresIn: "1h",
};

export async function generateJwt(email: string, userId: string) {
    let token: string | undefined;
    try {
        const payload = { email: email, id: userId };

        if (process.env.JWT_SECRET) {
            token = jwt.sign(payload, process.env.JWT_SECRET, options);
            return { error: false, token: token };
        } else {
            return { error: true, message: 'Not valid JWT secret key'}
        }

    } catch (error) {
        return { error: true };
    }
}
