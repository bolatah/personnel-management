import { ObjectId } from 'mongodb';
import { userCollection, IUser } from '../config';
import { employeeCollection, IEmployee } from '../config'; // Import the employeeCollection and IEmployee

export async function createUser(user: IUser): Promise<IUser> {

  const employeeId = new ObjectId(user.employeeId);
  const employee: IEmployee | null = await employeeCollection.findOne({ _id: employeeId });

  if (!employee) {
    throw new Error('Employee not found');
  }

  const userWithEmployee: IUser = {
    ...user,
    employeeInfo: {
      name: employee.personalInformation.name,
      position: employee.employmentDetails.position,
   
    },
  };

  const result = await userCollection.insertOne(userWithEmployee);
  return userWithEmployee;
}

export async function getUsers(): Promise<IUser[]> {
  return userCollection.find().toArray();
}

export async function getUserById(id: string): Promise<IUser | null> {
  const objectId = new ObjectId(id);
  return userCollection.findOne({ _id: objectId });
}

export async function updateUser(id: string, updatedUser: IUser): Promise<IUser | null> {
  const objectId = new ObjectId(id);
  const result = await userCollection.findOneAndUpdate(
    { _id: objectId },
    { $set: updatedUser },
    { returnDocument: 'after', projection: {} }
  );
  return result;
}

export async function deleteUser(id: string): Promise<IUser | null> {
  const objectId = new ObjectId(id);
  const result = await userCollection.findOneAndDelete({ _id: objectId });
  return result;
}
