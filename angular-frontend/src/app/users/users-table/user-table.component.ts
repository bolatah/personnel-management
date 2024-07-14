import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
//import {UserFormComponent } from '../../../components/user-form/user-form.component';
//import { ConfirmationDialogComponent } from 'components/confirmation-dialog/confirmation-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
//import { ConfirmationDialogComponent } from 'src/components/confirmation-dialog/confirmation-dialog.component';
import { Employee } from 'src/app/models/employee.model';
import { IdToNumberPipe } from 'src/app/pipes/id-to-number-pipe';
import { UserService } from 'src/app/services/user.service';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { selectAllUsers } from 'src/app/store/selectors/users.selectors';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
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
    CommonModule,
  ],
})
export class UserTableComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<User>;
  displayedColumns = ['ID', 'Name', 'Role', 'Actions'];
  usersSubscription: Subscription | undefined;
  showFullId = false;
  /*   displayConvertToUserDialog = false; // Flag to control the visibility of the conversion dialog */
  selectedUserForConversion: Employee | null = null;
  constructor(
    private userService: UserService,
    private store: Store<{ users: User[] }>,
    private dialog: MatDialog,
    //private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadUsers();
  }

  loadUsers() {
    this.store
      .pipe(select(selectAllUsers))
      .subscribe((users) =>
          (this.dataSource.data = users)
        );
     
  }

 openDialog(action: string, user?: User){
  let dialogRef;
  if(action === 'Add'){
    dialogRef = this.dialog.open (UserFormComponent, {
      width: '200px',
        height: '350px',
        data: {
          action: 'Add',
        },
        disableClose: true
    })
  } else if (action === 'Edit') {
    dialogRef = this.dialog.open(UserFormComponent, {
      width: '200px',
      height: '300px',
      data: {
        action : 'Edit',
        user : user
      }, disableClose: true
    })
  }
  dialogRef?.afterClosed().subscribe(()=> 
  this.loadUsers())
} 

 deleteUser(user: User) {
      const ref = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          action: 'Delete',
          item: user,
          serviceMethode : () => this.userService.deleteUser(user._id!), 
        },
        disableClose: true,
        width: '300px',
        height: "200px"
      });
      ref.afterClosed().subscribe(()=> {});
  }
 

  getShortenedId(id: string) {
    const maxLength = 8;
    return id.length > maxLength ? id.slice(0, maxLength) + '...' : id;
  }

  ngOnDestroy() {
    this.usersSubscription?.unsubscribe();
  }
}
