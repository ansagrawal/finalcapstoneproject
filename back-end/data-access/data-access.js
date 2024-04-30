import { MongoClient } from 'mongodb';
import { logger } from '../util/util.js';

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "usersdb";
let db;

async function connectToDb() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

async function findUser(username) {
    try {
        await connectToDb();
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ user: username });
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
        const prj = { user: 1, email: 1, _id: 0 };
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

export { findUser, getUsers };