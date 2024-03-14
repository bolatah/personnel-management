import {
  Component,
  ViewChild,
  OnInit,
  Inject,
  ElementRef,
} from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { Employee } from '../employee-list/employee.model';
import { EmployeeService } from '../employee-list/employee.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})

export class EmployeeFormComponent implements OnInit {
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  @ViewChild('proficiencyDropdown') proficiencyDropdown!: any;

  employee: Employee | null = null;
  currentSection: 'personalInformation' | 'employmentDetails' | 'skills' =
    'personalInformation';
  skillEntries: { skill: string; proficiency: string }[] = [];
  employeeForm!: FormGroup;
  isEditing = false;
  showCalendar: boolean = false;
  hasFormErrors: boolean = false;
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
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private employeeService: EmployeeService
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

    if (
      this.config.data &&
      this.config.data.employee &&
      this.config.data.employee._id
    ) {
      this.isEditing = true;
      this.employee = { ...this.config.data.employee };
      this.employeeForm.patchValue(this.config.data.employee);
    }

    const hireDateControl = this.employeeForm.get('employmentDetails.hireDate');
    const birthdayControl = this.employeeForm.get(
      'personalInformation.birthday'
    );

    if (birthdayControl) {
      birthdayControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.showCalendar = false;
          this.adjustFormSize();
        });
    }

    if (hireDateControl) {
      hireDateControl.valueChanges
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
    const formElement = document.getElementById('employeeForm');
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

  // Add skill to the skills FormArray
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

  // Getter method to safely retrieve the controls of the skills FormArray
  get skillControls(): AbstractControl[] {
    console.log(this.employeeForm.get('skill'));
    return (this.employeeForm.get('skills') as FormArray).controls;
  }

  /*   clearInputFields() {
    this.skillInput.nativeElement.value = '';
    this.proficiencyDropdown.clear();
  } */

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
