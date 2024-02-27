interface IEmployeeInfo {
  name: string;
  position?: string;
  // Add other relevant employee information
}

interface IUser {
/*   username: string;
  password: string; // Note: Store hashed passwords, not plaintext */
  role: string; // Define roles for authorization (e.g., 'user', 'admin')
  employeeId?: string; // Link to the corresponding employee
  employeeInfo?: IEmployeeInfo;
}

export default IUser;