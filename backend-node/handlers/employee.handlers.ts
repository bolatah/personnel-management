import { ObjectId } from 'mongodb';
import { employeeCollection, IEmployee } from '../config';

export async function createEmployee(employee: IEmployee): Promise<IEmployee> {
  const result = await employeeCollection.insertOne(employee);
  return employee
}

export async function getEmployees(): Promise<IEmployee[]> {
  return employeeCollection.find().toArray();
}

export async function getEmployeeById(id: string): Promise<IEmployee | null> {
  const objectId = new ObjectId(id);
  return employeeCollection.findOne({ _id: objectId });
}

export async function updateEmployee(id: string, updatedEmployee: IEmployee): Promise<IEmployee | null> {
  const objectId = new ObjectId(id);
  const result = await employeeCollection.findOneAndUpdate(
    { _id: objectId },
    { $set: updatedEmployee },
    { returnDocument: 'after', projection: {} }
  );
  return result;
}

export async function deleteEmployee(id: string): Promise<IEmployee | null> {
  const objectId = new ObjectId(id);
  const result = await employeeCollection.findOneAndDelete({ _id: objectId });
  return result;
}