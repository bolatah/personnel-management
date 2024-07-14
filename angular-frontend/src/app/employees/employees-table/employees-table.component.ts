import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { selectAllEmployees } from '../../store/selectors/employees.selectors';
import { DatePipe } from '@angular/common';
import { IdToNumberPipe } from '../../pipes/id-to-number-pipe';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { deleteEmployee } from '../../store/actions/employees.actions';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    DatePipe,
    IdToNumberPipe,
    RouterLink,
  ],
})
export class EmployeesTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Employee>;
  displayedColumns = [
    'ID',
    'Name',
    'Birthday',
    'Position',
    'Department',
    'Actions',
  ];
  departments = [
    { label: 'HR', value: 'hr' },
    { label: 'Finance', value: 'finance' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'IT', value: 'it' },
  ];
  employeesSubscription: Subscription | undefined;

  constructor(
    private store: Store<{ employees: Employee[] }>,
    private dialog: MatDialog,
    private employeesService: EmployeeService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Employee>();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadEmployees();
  }

  loadEmployees() {
    this.store.pipe(select(selectAllEmployees)).subscribe((employees) => {
      this.dataSource.data = employees;
    });
  }

  openDialog(action: string, employee?: Employee) {
    let dialogRef;
    if (action === 'Add') {
      dialogRef = this.dialog.open(EmployeeFormComponent, {
        width: '600px',
        height: ' 400px',
        data: {
          action: 'Add',
        },
        disableClose: true
      });
    } else if (action === 'Edit') {
      dialogRef = this.dialog.open(EmployeeFormComponent, {
        width: '600px',
        height: ' 400px',
        data: {
          action: 'Edit',
          employee: employee,
        },
        disableClose: true
      });
    }
    dialogRef?.afterClosed().subscribe(() => this.loadEmployees());
  }

  deleteEmployee(employee: Employee) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        action: 'Delete',
        item: employee,
        serviceMethode: () =>
          this.employeesService.deleteEmployee(employee._id!),
      },
      
    });

    ref.afterClosed().subscribe(() => {});
  }

  viewEmployeeDetails(employee: Employee) {
    const employeeId = employee._id;
    this.router.navigate(['/employees', employeeId]);
  }

  getShortenedId(id: string) {
    const maxLength = 8;
    return id.length > maxLength ? id.slice(0, maxLength) + '...' : id;
  }

  ngOnDestroy() {
    this.employeesSubscription?.unsubscribe();
  }
}
