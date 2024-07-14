import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { employeesReducer } from './store/reducers/employees.reducers';
import { provideNativeDateAdapter } from '@angular/material/core';
import { usersReducer } from './store/reducers/users.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideStore({employees: employeesReducer, users: usersReducer}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
};
