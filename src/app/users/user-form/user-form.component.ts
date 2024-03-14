import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Employee } from 'src/app/employee-list/employee.model';
import { EmployeeService } from 'src/app/employee-list/employee.service';
import { UserService } from '../users-list/user.service';
import { User } from '../users-list/user.model';
import { BehaviorSubject, filter, take } from 'rxjs';
@Component({
  selector: 'app-convert-to-user-dialog',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class ConvertEmployeeToUserComponent implements OnInit {
  @Input() user: User | null = null;
  userForm!: FormGroup;
  isEditing = false;
  employees: Employee[] = [];
  selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
 /*  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();*/
  selectedEmployee: Employee | null = null; 
  roleOptions = [{ label: 'User', value: 'user' }, { label: 'Admin', value: 'admin' }];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      employee: [null, Validators.required],
      role: [null, Validators.required],
    });

    this.employeeService.getEmployees().then((response) => {
      this.employees = response.filter(employee => !this.isEmployeeSelectedAsUser(employee)) || [];
    });

    if (
      this.config.data &&
      this.config.data.user &&
      this.config.data.user._id
    ) {
      this.isEditing = true;
      this.user = { ...this.config.data.user };

      this.userForm.patchValue({
        employee: this.user?.employeeInfo,
        role: this.user!.role
      });
    }
  }
  
 
  isEmployeeSelectedAsUser(employee: Employee): boolean {
    let isEmployeeSelected = false;
    this.userService.usersSubject.subscribe(users => {
      if (users) {
        isEmployeeSelected = users.some(user => user.employeeId === employee._id);
      }
    });
  
    return isEmployeeSelected;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
 
       const employeeId = this.isEditing && this.user ? this.user.employeeId : formData.employeeId;

      if (this.isEditing && this.user) {
        const updatedUserData: User = {
          ...this.user,
          employeeId: employeeId, 
          role: formData.role
        };
 
        this.userService.updateUser(updatedUserData, this.user._id).subscribe({
          next: () => {
            console.log('User updated successfully');
            this.userService.getUsers().then(() => {});
          },
          error: (error: any) => {
            console.error('Error updating user', error);
          },
        });
      } else {
    
        const newUserData: User = {
          employeeId: formData.employee._id, 
          employeeInfo: {
            name :  formData.employee.personalInformation.name,
            position: formData.employee.employmentDetails.position
          },
          role: formData.role
        };
        this.userService.addUser(newUserData).subscribe({
          next: () => {
            console.log('User added successfully');
            this.userService.getUsers().then(() => {});
          },
          error: (error: any) => {
            console.error('Error adding user', error);
          },
        });
      }
  
      this.ref.close(true);
    } else {
      console.warn('Invalid form submission');
    }
  }
  onCancel() {
    this.ref.close(false);
  }
}
