import {
  Component,
  ViewChild,
  OnInit,
  Inject,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class EmployeeFormComponent implements OnInit {
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  @ViewChild('proficiencyDropdown') proficiencyDropdown!: any;

  currentSection: 'personalInformation' | 'employmentDetails' | 'skills' =
    'personalInformation';
  skillEntries: { skill: string; proficiency: string }[] = [];
  employeeForm!: FormGroup;
  //hasFormErrors: boolean = false;
  departmentOptions: string[] = ['HR', 'Finance', 'Marketing', 'IT'];
  positionOptions: string[] = ['Manager', 'Engineer', 'Analyst', 'Consultant'];
  currencyOptions: string[] = ['USD', 'EUR', 'TRY'];
  statusOptions: string[] = [
    'Unqualified',
    'Qualified',
    'New',
    'Negotiation',
    'Renewal',
    'Proposal',
  ];
  proficiencyOptions: string[] = ['Beginner', 'Average', 'Expert'];

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: string; employee?: Employee }
  ) {}

  ngOnInit() {
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
        birthday: [undefined, this.validateBirthday],
      }),
      employmentDetails: this.fb.group({
        position: [''],
        department: [''],
        hireDate: [undefined],
        salaryAmount: [null, Validators.min(0)],
        salaryCurrency: ['EUR'],
        status: ['Unqualified'],
      }),
      skills: this.fb.array([
        this.fb.group({
          skill: [''],
          proficiency: [''],
        }),
      ]),
    });

    if (this.data.action === 'Edit' && this.data.employee) {
      console.log(this.data.employee)
      this.employeeForm.patchValue(this.data.employee);
    }
  }

  validateBirthday: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    if (control.pristine) {
      return null;
    }

    const birthdayDate = new Date(control.value);
    const today = new Date();

    let age = today.getFullYear() - birthdayDate.getFullYear();
    const monthDiff = today.getMonth() - birthdayDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdayDate.getDate())
    ) {
      age--;
    }

    if (age < 16) {
      return { invalidAge: true };
    }

    return null;
  };

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

  addSkill() {
    (this.employeeForm.get('skills') as FormArray).push(
      this.fb.group({
        skill: [''], // Initialize skill FormControl
        proficiency: [''], // Initialize proficiency FormControl
      })
    );
  }

  removeSkill(index: number) {
    (this.employeeForm.get('skills') as FormArray).removeAt(index);
  }

  get skillControls(): AbstractControl[] {
    return (this.employeeForm.get('skills') as FormArray).controls;
  }

  clearInputFields() {
    this.skillInput.nativeElement.value = '';
    this.proficiencyDropdown.clear();
  }

  onSubmit() {
    const controls = this.employeeForm.controls;

    if (this.employeeForm.valid) {
      if (this.currentSection === "skills") {
        const formData = this.employeeForm.value;

        if (this.data.action === 'Edit') {
          const id = this.data.employee?._id;
          if (id) {
            this.employeeService.updateEmployee(formData, id).subscribe({
              next: () => {
                this.dialogRef.close(formData);
                this.employeeService.getEmployees().subscribe(() => {});
              },
              error: (error: any) => {
                console.error('Error submitting form:', error);
              },
            });
          }
        } else if (this.data.action === 'Add') {
          this.employeeService.addEmployee(formData).subscribe({
            next: () => {
              this.dialogRef.close(formData);
              this.employeeService.getEmployees().subscribe(() => {});
            },
            error: (error: any) => {
              console.error('Error submitting form:', error);
            },
          });
        }
      }
      
    } else {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
