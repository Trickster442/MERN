import jwt from 'jsonwebtoken';

const authorize = (req, res, next) => {
    const token = req.headers.token; // Assuming the token is sent as "Bearer <token>"
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token
            req.userId = decoded.userId; // Assign the decoded userId to the request object
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ error: "Invalid or expired token." });
        }
    } else {
        return res.status(401).json({ error: "Authorization token is required." });
    }
};

export default authorize;
