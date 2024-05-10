import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: 'No authorization header' });
    }
    if (!authorization.startsWith("Bearer")) {
        return res.status(401).send({ error: 'Bearer schema expected' });
    }
    const splittedtoken = authorization.split("Bearer ");
    if (splittedtoken.length !== 2) {
        return res.status(401).send({ error: 'Invalid token' });
    }

    const token = splittedtoken[1];
    if (!token) return next(createError(401, "You are note authenticated!"));

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        next();
    })
}

export default verifyToken;