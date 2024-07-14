export class Employee {
  personalInformation: {
    name: string;
    age?: number;
    email?: string;
    phone?: string;
    address?: string;
    birthday?: Date;
  };
  employmentDetails: {
    position?: string;
    department?: string;
    hireDate?: Date;
    salaryAmount?: number;
    salaryCurrency?: string;
    status?: string;
  };
  _id?: string;
  profilePicture?: any;
  skills?: string[];
  missing?: boolean;
  missingPeriod?: any;

  constructor(data: Partial<Employee> = {}) {
    this.personalInformation = {
      name: data.personalInformation?.name || '',
      age: data.personalInformation?.age,
      email: data.personalInformation?.email || '',
      phone: data.personalInformation?.phone || '',
      address: data.personalInformation?.address || '',
      birthday: data.personalInformation?.birthday ? new Date(data.personalInformation.birthday) : undefined,
    };
    this.employmentDetails = {
      position: data.employmentDetails?.position || '',
      department: data.employmentDetails?.department || '',
      hireDate: data.employmentDetails?.hireDate ? new Date(data.employmentDetails.hireDate) : undefined,
      salaryAmount: data.employmentDetails?.salaryAmount || 0,
      salaryCurrency: data.employmentDetails?.salaryCurrency || '',
      status: data.employmentDetails?.status || '',
    };
    this.skills = data.skills || [];
    this._id = data._id || '';
    this.profilePicture = data.profilePicture;
    this.missing = data.missing || false;
    this.missingPeriod = data.missingPeriod || null;
  }
}
