import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeService } from '../employee-list/employee.service';
import { Employee } from '../employee-list/employee.model';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-absent-dialog',
  templateUrl: './absent-dialog.component.html',
  styleUrls: ['./absent-dialog.component.css']
})
export class AbsentDialogComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployeeId: string = '';
  absentForm!: FormGroup;
  showCalendar: boolean = false;
  absenceReasonOptions: string[] = [
    'Sick',
    'Holiday',
    'Other',
  ];

  constructor(private dialogRef: DynamicDialogRef, 
    private employeeService: EmployeeService,
    private fb: FormBuilder) {
      console.log(this.showCalendar)
     }

  ngOnInit(): void {
    this.employeeService.getEmployees().then(employees => {
      this.employees = employees;
    });

    this.absentForm = this.fb.group({
      selectedEmployeeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });

    const startDateControl = this.absentForm.get('startDate');
    const endDateControl = this.absentForm.get(
      'endDate'
    );
  

    if (startDateControl) {
      startDateControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.showCalendar = false;
          this.adjustFormSize();
        });
    }

    if (endDateControl) {
      endDateControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.showCalendar = false;
          this.adjustFormSize();
        });
    }

    
  }

  toggleCalendar() {
    this.showCalendar = true;
    this.adjustFormSize();
  }

  adjustFormSize() {
    const formElement = document.getElementById('absentForm');
    if (formElement) {
      if (this.showCalendar) {
        formElement.style.width = '90%';
        formElement.style.height = '70vh';
      } else {
        formElement.style.width = '100%';
        formElement.style.height = 'auto';
      }
    }
  }

  markAbsent(): void {
    if (this.absentForm.valid) {
      const data = this.absentForm.value;
      this.employeeService.markEmployeeAsMissing(data.selectedEmployeeId._id, data.startDate, data.endDate)
      .subscribe(
        {
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error submitting form:', error);
          },
        }
      )
      // Close the dialog and pass the input data back to the parent component
    //  this.dialogRef.close(this.absentForm.value);
    } else {
      // Mark all controls as touched to display validation errors
      this.markFormGroupTouched(this.absentForm);
    }
  }

  // Helper function to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }
}
