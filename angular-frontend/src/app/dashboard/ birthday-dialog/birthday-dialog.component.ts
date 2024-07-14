// upcoming-birthdays-dialog.component.ts
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';


@Component({
  selector: 'app-upcoming-birthdays-dialog',
  templateUrl: './birthday-dialog.component.html',
  styleUrls: ['./birthday-dialog.component.css'],
  standalone: true,
  imports: [DatePipe]
})
export class UpcomingBirthdaysDialogComponent {
  @Input() header: string = 'Upcoming Birthdays';
  @Input() employeesHavingBirthday: Employee[] = [];

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService
  ) {}
  ngOnInit(): void {
    this.employeeService.getUpcomingBirthdays().subscribe(
      (employees) => {
        this.employeesHavingBirthday = employees;
      }
    );
  }
}
