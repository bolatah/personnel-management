// convert-to-user-dialog.component.ts
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Employee } from 'src/app/employee-list/employee.model';
import { EmployeeService } from 'src/app/employee-list/employee.service';
import { UserService } from '../users-list/user.service';
import { User } from '../users-list/user.model';

@Component({
  selector: 'app-convert-to-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class ConvertToUserDialogComponent {
  @Input() employees: Employee[] | any[] = [];
  selectedEmployee: Employee | null = null;
  selectedRole: string = 'user';

  roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
  ];

  roleOptions: any[] = [];

  constructor(
    public dialogService: DialogService,
    private employeeService: EmployeeService,
    private userService: UserService,
    public ref: DynamicDialogRef,
    private cd: ChangeDetectorRef
  ) {}

ngOnInit() {
  // Fetch all employees
  this.employeeService.getEmployees().then((response) => {
    this.employees = response ? response : [];

    // Fetch all users to identify employees already selected as users
    this.userService.getUsers().then((users) => {
      // Get the IDs of employees already selected as users
      const selectedUserEmployeeIds = users.map((user: User) => user.employeeId);

      // Exclude employees already selected as users from the list
      this.employees = this.employees.filter((employee: Employee) => {
        return !selectedUserEmployeeIds.includes(employee._id);
      });

      // Manually trigger change detection to update the view
      this.cd.detectChanges();
    });
    
    this.roleOptions = this.roles;
  });
}


  onConvert() {
    if (this.selectedEmployee && this.selectedRole) {
     
      const convertData: any = {
        employeeId: this.selectedEmployee._id,
        roles: this.selectedRole,
      };

      // Send a POST request to the API endpoint
      this.userService.addUser(convertData)
        .subscribe({
            next: () => {
              this.userService.getUsers().then(() => {})
            },
            error: (error: any) => {
              console.error('Error converting an employee to user', error)
            },
          })
    } else {
      console.warn('Invalid selection for conversion');
    }
    this.ref.close(true)
  }

  onCancel() {
    this.ref.close(true)
  }
}
