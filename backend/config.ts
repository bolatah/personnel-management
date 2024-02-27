import * as dotenv from 'dotenv';
import { Collection, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import IEmployee from './models/employee.model';
import IUser from './models/user.model';

dotenv.config();

let employeeCollection: Collection<IEmployee>;
let userCollection: Collection<IUser>;
let mongoClient: MongoClient | null = null;

async function connectToMongo() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MongoDB URI is missing in the environment variables.');
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const database = client.db('personnel-management');
    employeeCollection = database.collection('employees');
    userCollection = database.collection('users');
    console.log('Connected to MongoDB');
    mongoClient = client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export { employeeCollection, userCollection, IUser, IEmployee, connectToMongo, mongoClient };
