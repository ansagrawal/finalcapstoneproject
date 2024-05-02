import express from "express";
const router = express.Router();
import { fetchLogs } from '../../data-access/data-access.js';
import { verifyAdminToken } from '../../auth/auth.js';

router.get("/access-logs", verifyAdminToken, async (req, res) => {
    try {
        const logs = await fetchLogs(); // Fetch all logs
        res.json(logs);
    } catch (error) {
        console.error('Error retrieving access logs:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;