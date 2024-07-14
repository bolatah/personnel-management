import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, filter, map, Observable, take, tap } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { User } from 'src/app/models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Store } from '@ngrx/store';
import { selectAllEmployees } from 'src/app/store/selectors/employees.selectors';
import { selectAllUsers } from 'src/app/store/selectors/users.selectors';
@Component({
  selector: 'app-convert-to-user-dialog',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class UserFormComponent implements OnInit {
  //@Input() user: User | null = null;
  userForm!: FormGroup;
  nonUserEmployees : Employee[]=[];

  selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  /*  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();*/
  selectedEmployee: Employee | null = null;
  roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: { action: string; user: User }
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      employee: [null, Validators.required],
      role: [null, Validators.required],
    });
  
    this.store.select(selectAllEmployees).pipe(
      tap(employees => console.log('All Employees:', employees)),
      map(employees => employees.filter(employee => !this.isEmployeeSelectedAsUser(employee)))
    ).subscribe(filteredEmployees => {
      this.nonUserEmployees = filteredEmployees;
      console.log('Non-User Employees:', this.nonUserEmployees);
    });
  
    if (this.data.action === 'Edit' && this.data.user) {
      this.userForm.patchValue({
        employee: this.data.user.employeeInfo,
        role: this.data.user.role,
      });
    }
  }
  
  isEmployeeSelectedAsUser(employee: Employee): boolean {
    let isEmployeeSelected = false;
    this.store.select(selectAllUsers).pipe(
      take(1),
    ).subscribe(users => {
      if (users) {
        isEmployeeSelected = users.some(user => user.employeeId === employee._id);
      }
    });
    return isEmployeeSelected;
  }
  

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      if (this.data.action === 'Edit' && this.data.user) {
        const employeeId = this.data.user._id;
        const updatedUserData: User = {
          ...this.data.user,
          employeeId: employeeId,
          role: formData.role,
        };
        if (employeeId) {
          this.userService.updateUser(updatedUserData, employeeId).subscribe(
            () => {
              this.dialogRef.close(updatedUserData);
            }
          );
        }
      } else if (this.data.action === 'Add') {
        const newUserData: User = {
          employeeId: formData.employee,
          role: formData.role,
        };
        this.userService.addUser(newUserData).subscribe(
          () => {
            this.dialogRef.close(newUserData);
          }
        );
      }
    } else {
      console.warn('Invalid form submission');
    }
  }
  onCancel() {
    this.dialogRef.close(false);
  }
}
