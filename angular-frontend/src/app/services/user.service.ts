// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../store/selectors/users.selectors';
import {
  addUser,
  deleteUser,
  loadUsers,
  updateUser,
} from '../store/actions/users.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiEndpoint + 'users';
  constructor(private httpClient: HttpClient, private store: Store) {}

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]> {
    return this.getUsers();
  }

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.apiUrl)
      .pipe(tap((users) => this.store.dispatch(loadUsers({ users }))));
  }

  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(this.apiUrl, user)
      .pipe(tap((user) => this.store.dispatch(addUser({ user }))));
  }

  getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/${userId}`);
  }

  updateUser(updatedUser: User, id: string): Observable<User> {
    return this.httpClient
      .put<User>(`${this.apiUrl}/${id}`, updatedUser)
      .pipe(tap((user: User) => this.store.dispatch(updateUser({ user }))));
  }

  deleteUser(userId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${userId}`)
      .pipe(tap(() => this.store.dispatch(deleteUser({ id: userId }))));
  }
}
