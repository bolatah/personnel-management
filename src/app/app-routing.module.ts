import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeService } from './employee-list/employee.service';
import { EmployeeCardComponent } from './employee-card/employee-card.component';
import { UserListComponent } from './users/users-list/user-list.component';
import { UserService } from './users/users-list/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [

  {
    path: '', component: DashboardComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'employees',
    component: EmployeeListComponent,
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
    component: UserListComponent, 
    resolve: {
      data: UserService, 
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
