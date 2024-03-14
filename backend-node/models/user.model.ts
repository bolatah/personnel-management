interface IEmployeeInfo {
  name: string;
  position?: string;
}

interface IUser {
  role: string; // Define roles for authorization (e.g., 'user', 'admin')
  employeeId?: string; // Link to the corresponding employee
  employeeInfo?: IEmployeeInfo;
}

export default IUser;