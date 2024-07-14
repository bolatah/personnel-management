import { createFeatureSelector, createSelector  } from "@ngrx/store";
import { UsersState } from "../reducers/users.reducers";


export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
    selectUsersState,
    (state : UsersState) => state.users
)