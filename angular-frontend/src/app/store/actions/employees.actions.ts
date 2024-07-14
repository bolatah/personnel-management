import { createAction, props } from '@ngrx/store';
import { Employee } from '../../models/employee.model';

export const loadEmployees = createAction(
  '[Employees] Load Employees',
  props<{ employees: Employee[] }>()
);
export const addEmployee = createAction(
  '[Employees] Add Employee',
  props<{ employee: Employee }>()
);
export const updateEmployee = createAction(
  '[Employees] Update Employee',
  props<{ employee: Employee }>()
);
export const deleteEmployee = createAction(
  '[Employees] Delete Employee',
  props<{ id: string }>()
);
export const setUpcomingBirthdays = createAction(
  '[Employees] Set Upcoming Birthdays',
  props<{ employees: Employee[] }>
);
export const markEmployeeAsMissing = createAction(
  '[Employees] Mark Employee as Missing',
  props<{ employee: Employee }>()
);
