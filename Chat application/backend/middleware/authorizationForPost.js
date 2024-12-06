import jwt from 'jsonwebtoken';

const authorize = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Authorization token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId; // Extract `userId` and attach it to `req`
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
    }
};


export default authorize;
