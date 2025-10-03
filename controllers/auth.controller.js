import AuthService from '../services/auth.service.js';
let authService = new AuthService();

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        const accessToken = await authService.authenticateUser(email, password);
        if (!accessToken) {
            return res.status(404).json({ error: "Wrong email or password" });
        }

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
}

export const logoutUser = async (req, res) => {
    res.clearCookie('accessToken').send({ status: 'Logged out' });
}

export const getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }

    const userPayload = { email: req.user.email, id: req.user.id };

    res.status(200).send(userPayload);
}