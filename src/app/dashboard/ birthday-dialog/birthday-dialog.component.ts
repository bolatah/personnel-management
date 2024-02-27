// upcoming-birthdays-dialog.component.ts
import { Component, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Employee } from 'src/app/employee-list/employee.model';



@Component({
  selector: 'app-upcoming-birthdays-dialog',
  templateUrl: './birthday-dialog.component.html',
  styleUrls: ['./birthday-dialog.component.css'],
})
export class UpcomingBirthdaysDialogComponent {
  @Input() header: string = 'Upcoming Birthdays';
  @Input() employees: Employee[] = [];
  constructor(private dialogService: DialogService) {}


}
