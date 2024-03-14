import { ObjectId } from "mongodb";

interface IEmployee {
    personalInformation: {
      name: string;
      age?: number;
      email?: string;
      phone?: string;
      address?: string;
      birthday: Date;
    };
    employmentDetails: {
      position?: string;
      department?: string;
      hireDate?: Date;
      salaryAmount?: number;
      salaryCurrency?: string;
      status? : string;
    };
    skills?: string[];
    _id?: ObjectId;
    missing?: boolean;
    missingPeriod: any; 
 
  }

  export default IEmployee;