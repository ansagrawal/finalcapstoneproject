import { MongoClient } from 'mongodb';
import { logger } from '../logs/logConfig.js';
import { AccessLog } from '../logs/accessLogModel.js';

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "usersdb";
let db;

async function connectToDb() {
    try {
        await client.connect();
        db = client.db(dbName);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

let accessLogCollection; // Global variable to store the collection

(async () => {
    const logAccessClient = new MongoClient(uri);
    await logAccessClient.connect(); // Wait for connection
    const db = logAccessClient.db(dbName);
    accessLogCollection = db.collection("accessLogs");
})(); // Connect to DB on startup

async function logAccess(token, endpoint, method) {
    const accessLog = new AccessLog(token, endpoint, method, new Date());
    try {
        await accessLogCollection.insertOne(accessLog); // Insert log into collection
        logger.info(`Token: ${token}, Endpoint: ${endpoint}, Method: ${method}`); // Log to console
    } catch (error) {
        console.error('Error logging access:', error);
    }
}

async function fetchLogs() {
    return await accessLogCollection.find().toArray();
}

async function findUser(username) {
    try {
        await connectToDb();
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ username: username });
        return user;
    } catch (error) {
        console.error('An error occurred while logging in:', error);
        throw error;
    } finally {
        // Ensure the database connection closes on exit
        await client.close();
    }

}

async function getUsers() {
    try {
        await connectToDb();
        const usersCollection = db.collection("users");
        const prj = { username: 1, email: 1, _id: 0 };
        const users = await usersCollection.find({}).project(prj).toArray();
        return users;
    } catch (error) {
        console.error('An error occurred while fetching users:', error);
        throw error;
    } finally {
        // Ensure the database connection closes on exit
        await client.close();
    }
}

async function createUser(newUser) {

    try {
        await connectToDb();
        const userCollection = db.collection("users");
        const filter = {
            $or: [
                { username: newUser.username },  // First condition
                { email: newUser.email }   // Second condition
            ]
        };
        const existingUser = await userCollection.findOne(filter); // Check for existing user
        if (existingUser) {
            return ["fail", null, 'User already exists'];
        }
        const result = await userCollection.insertOne(newUser);
        return ["success", result.insertedId, null]; // Success, return inserted ID
    } catch (err) {
        return ["fail", null, err.message]; // Error, return error message
    } finally {
        // Ensure the database connection closes on exit
        await client.close();
    }

}

export { findUser, getUsers, createUser, logAccess, fetchLogs };