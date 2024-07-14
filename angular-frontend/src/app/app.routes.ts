import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeService } from './services/employee.service';
import { EmployeesTableComponent } from './employees/employees-table/employees-table.component';
import { EmployeeCardComponent } from './employees/employee-card/employee-card.component';
import { UserTableComponent } from './users/users-table/user-table.component';
import { UserService } from './services/user.service';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'employees',
    component: EmployeesTableComponent,
    resolve: {
      data: EmployeeService,
    },
  },
  {
    path: 'employees/:id',
    component: EmployeeCardComponent,
  },
  {
    path: 'users',
    component: UserTableComponent,
    resolve: {
      data: UserService,
    },
  },
];
