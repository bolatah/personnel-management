import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export const loadUsers = createAction(
  '[Users] Load Users',
  props<{ users: User[] }>()
);
export const addUser = createAction(
  '[Users] Add User',
  props<{ user: User }>()
);
export const updateUser = createAction(
  '[Users] Update User',
  props<{ user: User }>()
);
export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ id: string }>()
);

