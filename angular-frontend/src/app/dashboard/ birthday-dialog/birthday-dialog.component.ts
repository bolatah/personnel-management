// upcoming-birthdays-dialog.component.ts
import { Component, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Employee } from 'src/app/employee-list/employee.model';
import { EmployeeService } from 'src/app/employee-list/employee.service';

@Component({
  selector: 'app-upcoming-birthdays-dialog',
  templateUrl: './birthday-dialog.component.html',
  styleUrls: ['./birthday-dialog.component.css'],
})
export class UpcomingBirthdaysDialogComponent {
  @Input() header: string = 'Upcoming Birthdays';
  @Input() employeesHavingBirthday: Employee[] = [];

  constructor(
    private dialogService: DialogService,
    private employeeService: EmployeeService
  ) {}
  ngOnInit(): void {
    // Fetch data from the service
    this.employeeService.getUpcomingBirthdays().subscribe(
      (employees) => {
        this.employeesHavingBirthday = employees;
      },
      (error) => {
        console.error('Error fetching total employees:', error);
      }
    );
  }
}
