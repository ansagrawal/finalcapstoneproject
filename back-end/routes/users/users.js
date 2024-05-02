import express from "express";
const router = express.Router();
import { validateUserData, validateNewUser, validateEmailDomain } from '../../util/util.js';
import { findUser, getUsers, createUser } from '../../data-access/data-access.js';
import { isAuthenticated, generateAccessToken, hashPassword, verifyUserToken } from '../../auth/auth.js';



router.post('/', validateNewUser, async (req, res) => {

    const newUser = req.body;

    try {
        newUser.password = await hashPassword(newUser.password);
        const [status, id, errMessage] = await createUser(newUser);
        if (status === "success") {
            newUser._id = id; // Add _id property for response
            return res.status(201).json(newUser); // Created (201) with admin data
        }
        console.error(errMessage); // Log error message for debugging
        return res.status(400).send({ message: errMessage }); // Bad Request (400) with error message
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error'); // Generic error for unexpected issues
    }
});

router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    if (!validateUserData(username, password)) {
        return res.status(400).send({ message: 'Invalid login details' });
    }

    const registeredUser = await findUser(username);
    if (!registeredUser || !await isAuthenticated(password, registeredUser.password)) {
        return res.status(401).send({ message: 'Incorrect username or password' });
    }
    let token;
    if (validateEmailDomain(registeredUser.email)) {
        token = generateAccessToken(username, password);
    } else {
        token = '';
    }
    res.json({ message: 'Login successful!', token: { token } });
});

router.get('/', async (req, res) => {
    try {
        res.json(await getUsers());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
