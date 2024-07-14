import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-absent-form',
  templateUrl: './absent-form.component.html',
  styleUrls: ['./absent-form.component.css'],
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class AbsentFormComponent implements OnInit {
  absentForm!: FormGroup;
  employees: Employee[] = [];
  selectedEmployeeId: string = '';
  showCalendar: boolean = false;
  absenceReasonOptions: string[] = ['Sick', 'Holiday', 'Other'];

  constructor(
    private dialogRef: MatDialogRef<AbsentFormComponent>,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.employeeService
      .getEmployees()
      .subscribe((employees) => (this.employees = employees));

    this.absentForm = this.fb.group({
      selectedEmployeeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  markAbsent(): void {
    if (this.absentForm.valid) {
      const data = this.absentForm.value;
      this.employeeService
        .markEmployeeAsMissing(
          data.selectedEmployeeId,
          data.startDate,
          data.endDate
        )
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error submitting form:', error);
          },
        });
    } else {
      this.markFormGroupTouched(this.absentForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
