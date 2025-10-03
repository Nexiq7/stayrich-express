import jwt from 'jsonwebtoken';

export const jwtAuth = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    try {
        const user = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("accessToken");
        return res.status(403).send('Invalid or Expired Token');
    }
}