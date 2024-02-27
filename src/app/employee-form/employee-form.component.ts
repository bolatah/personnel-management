import { Component, ViewChild, OnInit, Inject, ElementRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Employee } from '../employee-list/employee.model';
import { EmployeeService } from '../employee-list/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  @ViewChild('proficiencyDropdown') proficiencyDropdown!: any; // Use appropriate type

  employee: Employee | null = null;
  currentSection: 'personalInformation' | 'employmentDetails' | 'skills' =
    'personalInformation';
  departmentOptions: string[] = ['HR', 'Finance', 'Marketing', 'IT'];
  positionOptions: string[] = ['Manager', 'Engineer', 'Analyst', 'Consultant'];
  skillEntries: { skill: string; proficiency: string }[] = [];
  employeeForm!: FormGroup;
  statuses: any[] | undefined;
  skills: string[] = [];
  isEditing = false;
  showCalendar: boolean = false;
  hasFormErrors: boolean = false;
  currencyOptions: any[] = [
    { name: 'USD', value: 'USD' },
    { name: 'EUR', value: 'EUR' },
    { name: 'TRY', value: 'TRY' },
  ];
  rangeDates: Date[] | undefined;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' },
    ];

    this.employeeForm = this.fb.group({
      personalInformation: this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
            Validators.pattern(/^[a-zA-Z ]*$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.pattern(
              /^(\+\d{1,3}[-.\s]?)?(\(\d{1,4}\)|\d{1,4})[-.\s]?\d{6,}$/
            ),
          ],
        ],
        address: [''],
        birthday: [undefined],
      }),
      employmentDetails: this.fb.group({
        position: [''],
        department: [''],
        hireDate: [undefined],

        salaryAmount: [null, Validators.min(0)],
        salaryCurrency: [{ name: 'EUR', value: 'EUR' }],
        status: [''],
      }),
      skills: [''],
    });

    if (
      this.config.data &&
      this.config.data.employee &&
      this.config.data.employee._id
    ) {
      this.isEditing = true;
      this.employee = { ...this.config.data.employee };
      this.employeeForm.patchValue(this.config.data.employee);
    }

    // Subscribe to changes in the hireDate control

    const hireDateControl = this.employeeForm.get('employmentDetails.hireDate');
    const birthdayControl = this.employeeForm.get(
      'personalInformation.birthday'
    );
    console.log(hireDateControl, birthdayControl);
    if (hireDateControl) {
      hireDateControl.valueChanges.subscribe(() => {
        this.showCalendar = false;
        this.adjustFormSize(); // Optionally adjust the form size after hiding the calendar
      });
    }
    if (birthdayControl) {
      birthdayControl.valueChanges.subscribe(() => {
        this.showCalendar = false;
        this.adjustFormSize(); // Optionally adjust the form size after hiding the calendar
      });
    }
  }

  /*   salaryCurrencyRequiredIfAmountEntered(group: FormGroup) {
    const amount = group.get('amount')?.value;
    const currency = group.get('currency')?.value;

    return amount && !currency ? { salaryCurrencyRequired: true } : null;
  } */

  toggleCalendar() {
    this.showCalendar = true;
    this.adjustFormSize();
  }

  adjustFormSize() {
    // Adjust form size based on the showCalendar state
    const formElement = document.getElementById('employeeForm');
    if (formElement) {
      if (this.showCalendar) {
        formElement.style.width = '1000px'; // Adjust width as needed
        formElement.style.height = '650px'; // Adjust height as needed
      } else {
        formElement.style.width = '100%';
        formElement.style.height = 'auto';
      }
    }
  }

  nextSection() {
    const personalInformationForm = this.employeeForm.get(
      'personalInformation'
    );
    const employmentDetailsForm = this.employeeForm.get('employmentDetails');
    if (
      this.currentSection === 'personalInformation' &&
      personalInformationForm?.valid
    ) {
      this.currentSection = 'employmentDetails';
    } else if (
      this.currentSection === 'employmentDetails' &&
      employmentDetailsForm?.valid
    ) {
      this.currentSection = 'skills';
    }
  }

  prevSection() {
    if (this.currentSection === 'employmentDetails') {
      this.currentSection = 'personalInformation';
    } else if (this.currentSection === 'skills') {
      this.currentSection = 'employmentDetails';
    }
  }

  addSkill(skill: string, proficiency: string) {
    if (skill && proficiency) {
      this.skillEntries.push({ skill, proficiency });
      // Clear input fields after adding skill
      this.clearInputFields();
    }
  }
  
  clearInputFields() {
    // Clear skill input and proficiency dropdown
    this.skillInput.nativeElement.value = '';
    this.proficiencyDropdown.clear();
  }

  onSubmit() {
    const controls = this.employeeForm.controls;

    if (this.employeeForm.valid) {
      this.hasFormErrors = false;
      const formData = this.employeeForm.value as Employee;
      if (this.isEditing && this.employee) {
        // Editing existing employee
        this.employeeService
          .updateEmployee(formData, this.employee._id)
          .subscribe({
            next: () => {
              this.ref.close(true);
              this.employeeService.getEmployees().then(() => {});
            },
            error: (error: any) => {
              console.error('Error submitting form:', error);
            },
          });
      } else {
        this.employeeService.addEmployee(formData).subscribe({
          next: () => {
            this.ref.close(true);
            this.employeeService.getEmployees().then(() => {});
          },
          error: (error: any) => {
            console.error('Error submitting form:', error);
          },
        });
      }
    } else {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }
  }
  onCancel() {
    this.ref.close();
  }
}
