// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiEndpoint + 'users';
  users: User[] = [];
  usersSubject = new BehaviorSubject<User[] | null>(null);

  constructor(private httpClient: HttpClient) {}

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
   Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
    Promise.all([this.getUsers()]).then(()=>{
      resolve();
    }, reject);
    });
  }

  // Method to add a user
  addUser(user: User): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, user);
  }

  // Method to get all users and update the usersSubject
  getUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.httpClient.get<User[]>(this.apiUrl).subscribe({
        next: (users) => {
          this.users = users;
          this.usersSubject.next(this.users);
          resolve(users);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          resolve([]);
        },
      });
    });
  }

  // Method to get a specific user by ID
  getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/${userId}`);
  }

  // Method to update a user
  updateUser(updatedUser: User, id: any): Observable<void> {
    // Create a new object without the _id field
    const userWithoutId: User = { ...updatedUser };
    delete userWithoutId._id; // Remove the _id property
    return this.httpClient.put<void>(`${this.apiUrl}/${id}`, userWithoutId);
  }

  // Method to delete a user
  deleteUser(userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
