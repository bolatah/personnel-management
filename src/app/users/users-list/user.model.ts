export interface User {
/*     username: string;
    password: string;  */
    roles: string; // Define roles for authorization (e.g., 'user', 'admin')
    employeeId?: string; // Link to the corresponding employee
    _id?: string;
  }
  