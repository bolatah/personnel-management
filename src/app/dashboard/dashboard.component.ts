import { Component } from '@angular/core';
import { EmployeeService } from '../employee-list/employee.service';
import { UpcomingBirthdaysDialogComponent } from './ birthday-dialog/birthday-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Employee } from '../employee-list/employee.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor( private dialogService: DialogService,
    private employeeService: EmployeeService
    ) {}
  totalEmployees: number | null = null;
  upcomingBirthdaysNumber: number | null = null;
  upcomingBirthdays: Employee[] = [];
 
  ngOnInit(): void {
    // Fetch data from the service
    this.employeeService.getTotalEmployeesCount().then(
      (count) => {
        this.totalEmployees = count;
      },
      (error) => {
        console.error('Error fetching total employees count:', error);
      }
    );
    // Fetch upcoming birthdays
   this.fetchUpcomingBirthdays()
  }

  openUpcomingBirthdaysDialog() {
    if (this.upcomingBirthdaysNumber && this.upcomingBirthdaysNumber > 0) {
      const ref = this.dialogService.open(UpcomingBirthdaysDialogComponent, {
        header: 'Upcoming Birthdays',
        data: {
          header: 'Upcoming Birthdays',
          employees: this.upcomingBirthdays,
        },
      });

      ref.onClose.subscribe(() => {
        // Handle dialog close if needed
      });
    }
  }

  private fetchUpcomingBirthdays() {
    this.employeeService.getUpcomingBirthdays().subscribe(
      (employees) => {
        this.upcomingBirthdays = employees;
        this.upcomingBirthdaysNumber= employees.length
      },
      (error) => {
        console.error('Error fetching upcoming birthdays:', error);
      }
    );
  }
}
