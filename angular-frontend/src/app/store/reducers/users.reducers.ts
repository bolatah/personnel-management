import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { loadUsers, addUser, updateUser, deleteUser } from '../actions/users.actions';

export interface UsersState {
  users: User[];
}

export const initialUsersState: UsersState = {
  users: [],
};

export const usersReducer = createReducer(
  initialUsersState,
  on(loadUsers, (state, { users }) => ({
    ...state,
    users,
  })),
  on(addUser, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),
  on(updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map((t) => (t._id === user._id ? user : t)),
  })), 
  on(deleteUser, (state, {id})=> ({
    ...state, 
    users : state.users.filter((t)=> t._id !== id)
  }))
);
