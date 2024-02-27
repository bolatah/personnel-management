import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = environment.apiEndpoint + 'employees';
  employees: Employee[] = [];
  employeesSubject = new BehaviorSubject<Employee[] | null>(null); 

  constructor(private httpClient: HttpClient) {}

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getEmployees()]).then(() => {
        resolve();
      }, reject);
    });
  }

  // Method to add an employee
  addEmployee(employee: Employee): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, employee);
  }

  // Method to get all employees and update the employeesSubject
  getEmployees(): Promise<Employee[]> {
    return new Promise<Employee[]>((resolve, reject) => {
      this.httpClient.get<Employee[]>(this.apiUrl).subscribe({
        next: (employees) => {
          this.employees = employees;
          this.employeesSubject.next(this.employees);
          resolve(employees);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          resolve([]);;
        },
      });
    });
  }
  
  // Method to get a specific employee by ID
  getEmployeeById(employeeId: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.apiUrl}/${employeeId}`);
  }

  // Method to update an employee
  updateEmployee(updatedEmployee: Employee, id: any): Observable<void> {
    // Create a new object without the _id field
    const employeeWithoutId: Employee = { ...updatedEmployee };
    delete employeeWithoutId._id; // Remove the _id property
    return this.httpClient.put<void>(`${this.apiUrl}/${id}`, employeeWithoutId);
  }

  // Method to delete an employee
  deleteEmployee(employeeId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${employeeId}`);
  }
    // Method to get the total number of employees
    getTotalEmployeesCount(): Promise<number> {
      return this.getEmployees().then(
        (employees) => employees.length
      );
    }

      // Method to get employees whose birthdays are coming in the next 7 days
      getUpcomingBirthdays(): Observable<Employee[]> {
        const currentDate = new Date();
        const sevenDaysLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return this.employeesSubject.pipe(
          // Use map to filter employees based on upcoming birthdays
          map(employees => {
            if (!employees) {
              return [];
            }
            return employees.filter(employee =>
              employee.personalInformation.birthday &&
              new Date( employee.personalInformation.birthday).getTime() >= currentDate.getTime() &&
              new Date( employee.personalInformation.birthday).getTime() <= sevenDaysLater.getTime()
            );
          })
        );
      }
}
