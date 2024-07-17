import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Employee } from '../models/employee.model';
import { Store } from '@ngrx/store';
import {
  addEmployee,
  loadEmployees,
  updateEmployee,
  deleteEmployee,
  markEmployeeAsMissing,
} from '../store/actions/employees.actions';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = environment.apiEndpoint + 'employees';
  employeesSubject = new BehaviorSubject<Employee[]>([]);

  constructor(private httpClient: HttpClient, private store: Store) {
    this.getEmployees().subscribe(() => {});
  }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Employee[]> {
    return this.getEmployees();
  }

  getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.apiUrl).pipe(
      tap((employees: Employee[]) => {
        this.employeesSubject.next(employees);
        this.store.dispatch(loadEmployees({ employees }));
      })
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient
      .post<Employee>(this.apiUrl, employee)
      .pipe(
        tap((newEmployee: Employee) =>
          this.store.dispatch(addEmployee({ employee: newEmployee }))
        )
      );
  }

  getEmployeeById(employeeId: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.apiUrl}/${employeeId}`);
  }

  updateEmployee(updatedEmployee: Employee, id: string): Observable<Employee> {
    return this.httpClient
      .put<Employee>(`${this.apiUrl}/${id}`, updatedEmployee)
      .pipe(
        tap((employee: Employee) =>
          this.store.dispatch(updateEmployee({ employee: employee }))
        )
      );
  }

  deleteEmployee(employeeId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${employeeId}`)
      .pipe(tap(() => this.store.dispatch(deleteEmployee({ id: employeeId }))));
  }

  getUpcomingBirthdays(): Observable<Employee[]> {
    const currentDate = new Date();
    const sevenDaysLater = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    return this.employeesSubject.pipe(
      map((employees) => {
        return employees.filter((employee) => {
          const birthdayStr = employee.personalInformation.birthday;
          if (!birthdayStr) {
            return false; 
          }

          const birthday = new Date(birthdayStr);
          if (isNaN(birthday.getTime())) {
            return false; 
          }

          const birthdayThisYear = new Date(
            currentDate.getFullYear(),
            birthday.getMonth(),
            birthday.getDate()
          );

          return (
            birthdayThisYear >= currentDate &&
            birthdayThisYear <= sevenDaysLater
          );
        });
      })
    );
  }

  markEmployeeAsMissing(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ): Observable<void> {
    const missingFlag = true;
    const missingPeriod = { start: startDate, end: endDate };
    return this.httpClient
      .patch<void>(`${this.apiUrl}/${employeeId}`, {
        missing: missingFlag,
        missingPeriod,
      })
      .pipe(
        tap(() => {
          const updatedEmployee = {
            _id: employeeId,
            missing: true,
            missingPeriod,
          } as Employee;
          this.store.dispatch(
            markEmployeeAsMissing({ employee: updatedEmployee })
          );
        })
      );
  }
}
