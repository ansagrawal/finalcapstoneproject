import express from "express";
const router = express.Router();
import { validateUserData, validateNewUser } from '../../util/util.js';
import { findUser, getUsers } from '../../data-access/data-access.js';
import { isAuthenticated, generateAccessToken, hashPassword, verifyUserToken } from '../../auth/auth.js';


router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    if (!validateUserData(username, password)) {
        return res.status(400).send({ message: 'Invalid login details' });
    }

    const registeredUser = await findUser(username);
    console.log(registeredUser);
    if (!registeredUser || !await isAuthenticated(password, registeredUser.password)) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }
    const token = generateAccessToken(username, password);
    res.json({ token });
});

router.get('/', async (req, res) => {
    try {
        res.json(await getUsers());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
