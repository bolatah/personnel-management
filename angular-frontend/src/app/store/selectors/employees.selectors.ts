import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeesState } from "../reducers/employees.reducers";

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');

export const selectAllEmployees = createSelector(
    selectEmployeesState,
    (state : EmployeesState) => state.employees
)


