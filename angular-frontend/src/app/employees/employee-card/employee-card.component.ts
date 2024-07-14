import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule],
})
export class EmployeeCardComponent {
  employee!: Employee;
  tabs: Tab[] = [
    { key: 'General Information', title: 'General Information' },
    { key: 'Working Hours', title: 'Working Hours' },
    { key: 'Training', title: 'Training' },
    { key: 'Salary', title: 'Salary' },
    { key: 'Skills', title: 'Skills' },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  goBack() {
    this.router.navigate(['/employees']);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const employeeId = params['id'];
      this.employeeService.getEmployeeById(employeeId).subscribe((employee) => {
        this.employee = employee;
      });
    });
  }
}
interface Tab {
  key: string;
  title: string;
  // Add more properties as needed
}
