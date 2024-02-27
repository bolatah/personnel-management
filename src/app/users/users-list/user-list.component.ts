// user-list.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { ConfirmationService, FilterService, MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Employee } from 'src/app/employee-list/employee.model';
import { ConvertToUserDialogComponent } from '../user-dialog/user-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})

export class UserListComponent implements OnInit, OnDestroy {
  @Input() users: User[] | null = [];
  @ViewChild(Menu, { static: true }) contextMenu!: Menu;
  @ViewChild(Table, { static: true }) dt1!: Table;
  contextMenuVisible = false;
  isFilterApplied = false;
  usersSubscription: Subscription | undefined;
  items: MenuItem[] | undefined;
 contextMenuData: User | null = null;
  showFullId = false;
/*   displayConvertToUserDialog = false; // Flag to control the visibility of the conversion dialog */
  selectedUserForConversion: Employee | null = null;
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private filterService: FilterService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editUser(),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteUser(),
      },
    ];
    this.usersSubscription = this.userService.usersSubject.subscribe((updatedUsers) => {
      this.users = updatedUsers;
      console.log(updatedUsers)
      this.cd.markForCheck();
    });
  }

  openConvertToUserDialog() {
    const ref = this.dialogService.open(ConvertToUserDialogComponent, {
      header: 'Convert Employee to User',
      width: '70%',
      data: {
        employees: this.users, 
      },
      baseZIndex: 10000, 
    });
  }

  setContextMenuData(user: User) {
    this.contextMenuData = user;
  }

   editUser() {
    if (this.contextMenuData) {
      const ref = this.dialogService.open(ConvertToUserDialogComponent, {
        header: 'Edit User',
        width: '400px',
        data: { user: this.contextMenuData },
      });

      ref.onClose.subscribe((result: any) => {
        if (result) {
        
          console.log('Form submitted:', result);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee Updated',
          });
        }
      });
    }
  } 

  deleteUser() {
    if (this.contextMenuData) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        header: 'Confirmation',
        data: {
          data: this.contextMenuData,
          deleteFunction: (user: User) => this.userService.deleteUser(user._id as any),
          updateList: () => this.userService.getUsers(),
        },
        width: '500px',
      });
      ref.onClose.subscribe((result) => {
        if (result) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Delete',
            detail: 'User Deleted',
          });
        }
      });
    }
  }

 

/* closeConvertToUserDialog() {
  // Close the dialog without converting
  this.displayConvertToUserDialog = false;
} */

getShortenedId(id: string) {
  const maxLength = 8;
  return id.length > maxLength ? id.slice(0, maxLength) + '...' : id;
}

  ngOnDestroy() {
    this.usersSubscription?.unsubscribe();
  }
}
