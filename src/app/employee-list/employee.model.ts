export class Employee {
  personalInformation: {
    name: string;
    age?: number;
    email?: string;
    phone?: string;
    address?: string;
    birthday: Date | undefined;
  };
  employmentDetails: {
    position?: string;
    department?: string;
    hireDate?: Date | undefined;
    salaryAmount?: number;
    salaryCurrency?: string;
    status?: any;
  };
  _id?: string;
  profilePicture?: any;
  skills?: string[];

  constructor(data: any) {
    data = data || {};
    this.personalInformation = {
      name: data.name || '',
      age: data.age || 0,
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      birthday: data.birthday || '',
    };
    this.employmentDetails = {
      position: data.position || '',
      department: data.department || '',
      hireDate: data.hireDate !== null ? new Date(data.hireDate) : undefined,
      salaryAmount: data.salaryAmount || 0,
      salaryCurrency: data.salaryCurrency || "",
      status: data.status || '',
    };
    this.skills = data.skills || [];
    this._id = data._id || '';
  }
}
