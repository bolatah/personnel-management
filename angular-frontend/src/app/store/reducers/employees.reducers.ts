import { createReducer, on } from '@ngrx/store';
import {
  loadEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  markEmployeeAsMissing,
} from '../actions/employees.actions';
import { Employee } from 'src/app/models/employee.model';

export interface EmployeesState {
  employees: Employee[];
}
export const initialEmployeesState: EmployeesState = {
  employees: [],
};

export const employeesReducer = createReducer(
  initialEmployeesState,
  on(loadEmployees, (state, { employees }) => ({
    ...state,
    employees,
  })),
  on(addEmployee, (state, { employee }) => ({
    ...state,
    employees: [...state.employees, employee],
  })),
  on(updateEmployee, (state, { employee }) => ({
    ...state,
    employees: state.employees.map((t) => (t._id === employee._id ? employee : t)),
  })),
  on(deleteEmployee, (state, { id }) => ({
    ...state,
    employees: state.employees.filter((t) => t._id !== id),
  })),
  on(markEmployeeAsMissing, (state, {employee})=> ({
    ...state,
    employees: state.employees.map((e)=> (e._id === employee._id ? employee : e))
  }))
)

