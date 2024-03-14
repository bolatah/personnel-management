import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  FilterService,
  MenuItem,
  MessageService,
  SortEvent,
} from 'primeng/api';
import { Menu } from 'primeng/menu';
import { EmployeeService } from './employee.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Subscription } from 'rxjs';
import { Employee } from './employee.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { User } from '../users/users-list/user.model';
import { UserService } from '../users/users-list/user.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  @Input() employees: Employee[] | null = [];
  @ViewChild(Menu, { static: true }) contextMenu!: Menu;
  @ViewChild(Table, { static: true }) dt1!: Table;

  isFilterApplied = false;
  departments!: any[];
  employeesSubscription: Subscription | undefined;
  items: MenuItem[] | undefined;
  contextMenuData: Employee | null = null;
  showFullId = false;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private filterService: FilterService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.departments =[
      { label: 'HR', value: 'hr' },
      { label: 'Finance', value: 'finance' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'IT', value: 'it' },
    ]; 
    this.items = [
      {
        label: 'View Details',
        icon: 'pi pi-info',
        command: () => this.viewEmployeeDetails(),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editEmployee(),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteEmployee(),
      },
    ];
    this.employeesSubscription =
      this.employeeService.employeesSubject.subscribe((updatedEmployees) => {
        this.employees = updatedEmployees;
        this.cd.markForCheck();
      });
    console.log(this.employees);
  }

  handleSearchInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.dt1.filterGlobal(inputElement.value, 'contains');
  }

  handleFilterEvent(event: any) {
    this.isFilterApplied = this.checkFilter(event.filters);
    console.log(this.isFilterApplied, this.dt1.filteredValue);
  }

  checkFilter(filters: { [key: string]: { value: any }[] }): boolean {
    const keys = Object.keys(filters);

    if (keys.length === 0) {
      return false;
    }

    const hasValidFilter = keys.some((key) => {
      const filterArray = filters[key];
      return (
        Array.isArray(filterArray) &&
        filterArray.some(
          (filter) => filter.value !== null && filter.value !== undefined
        )
      );
    });

    return hasValidFilter;
  }

  getSeverity(status: string): string | undefined {
    if (status === 'High') {
      return 'danger';
    } else if (status === 'Medium') {
      return 'warning';
    } else if (status === 'Low') {
      return 'success';
    } else {
      // Handle other cases or provide a default value
      return undefined;
    }
  }

  clear(table: Table) {
    table.clear();
  }

  openAddEmployeeForm() {
    const ref = this.dialogService.open(EmployeeFormComponent, {
      header: 'Add Employee',
      data: { employee: {} },
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        console.log('Form submitted:', result);
      }
    });
  }

  setContextMenuData(employee: Employee) {
    this.contextMenuData = employee;
  }

  editEmployee() {
    if (this.contextMenuData) {
      const ref = this.dialogService.open(EmployeeFormComponent, {
        header: 'Edit Employee',
        data: { employee: this.contextMenuData },
      });

      ref.onClose.subscribe((result: any) => {
        if (result) {
          // Handle the result if needed
          console.log('Form submitted:', result);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee Updated',
          });
        }
      });
    }
  }

  async deleteEmployee() {
    if (this.contextMenuData) {
      // Check if the employee is also a user
      const user = (
        await this.userService
          .getUsers()
          .then((response) =>
            response.filter(
              (user) => user.employeeId === this.contextMenuData!._id
            )
          )
      )[0];

      if (user) {
        // If the employee is also a user, ask for confirmation
        const userRef = this.dialogService.open(ConfirmationDialogComponent, {
          header: 'Confirmation',
          data: {
            data: this.contextMenuData,
            deleteFunction: () => this.userService.deleteUser(user._id as any),
            updateList: () => this.userService.getUsers(),
          },
          width: '500px',
        });

        userRef.onClose.subscribe((userResult) => {
          if (userResult !== undefined) {
            console.log(userResult);

            const employeeRef = this.dialogService.open(
              ConfirmationDialogComponent,
              {
                header: 'Confirmation',
                data: {
                  data: this.contextMenuData,
                  deleteFunction: (employee: Employee) =>
                    this.employeeService.deleteEmployee(employee._id as any),
                  updateList: () => this.employeeService.getEmployees(),
                },
                width: '500px',
              }
            );

            employeeRef.onClose.subscribe((employeeResult) => {
              if (employeeResult) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Delete',
                  detail: 'Employee and associated User Deleted',
                });
              }
            });
          }
        });
      } else {
        // If the employee is not a user, proceed with the deletion
        const ref = this.dialogService.open(ConfirmationDialogComponent, {
          header: 'Confirmation',
          data: {
            data: this.contextMenuData,
            deleteFunction: (employee: Employee) =>
              this.employeeService.deleteEmployee(employee._id as any),
            updateList: () => this.employeeService.getEmployees(),
          },
          width: '500px',
        });

        ref.onClose.subscribe((result) => {
          if (result) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Delete',
              detail: 'Employee Deleted',
            });
          }
        });
      }
    }
  }

  viewEmployeeDetails() {
    if (this.contextMenuData) {
      const employeeId = this.contextMenuData._id;
      this.router.navigate(['/employees', employeeId]);
    }
  }

  getShortenedId(id: string) {
    const maxLength = 8;
    return id.length > maxLength ? id.slice(0, maxLength) + '...' : id;
  }

  ngOnDestroy() {
    this.employeesSubscription?.unsubscribe();
  }
}
