// sidebar.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AbsentDialogComponent } from './absent-dialog.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  showSidebar: boolean = false; 
  showSidebarSubject = new BehaviorSubject<boolean>(this.showSidebar);
  activeNestedTab: string | null = null; 
  items: any[] | undefined;
  itemsArray: any[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-desktop',
      command: () => {
        this.router.navigate(['/dashboard']);
      },
    },
    {
      label: 'Employees',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'View Employees',
          icon: 'pi pi-fw pi-align-center',
          command: () => {
            this.router.navigate(['/employees']);
          },
        },
        {
          label: 'Mark Absent',
          icon: 'pi pi-fw pi-calendar-plus',
          command: () => {
            this.openAbsentDialog(); // Open the dialog when clicked
          },
        },
      ],
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Users',
          icon: 'pi pi-fw pi-users',
          command: () => {
            this.router.navigate(['/users']);
          },
        },
      ],
    },
  ];

  constructor(private router: Router, private dialogService: DialogService, ) {
    this.showSidebarSubject.subscribe(value => {
      this.showSidebar = value;
    });
  }
  
  ngOnInit() {
    this.items = this.itemsArray;
    
  }
  
  toggleSidebar(){
 
    this.showSidebarSubject.next(!this.showSidebarSubject.value);
   
  }  

  onClickCloseIcon(): void{
    this.showSidebarSubject.next(false)
   
  }

  onTabClick(item: any): void {
    if (item.items) {
      // If the item has child items, toggle visibility of sub-tabs
      if (this.activeNestedTab === item.label) {
        this.activeNestedTab = null;
      } else {
        this.activeNestedTab = item.label;
      }
    } else {
      // If the item has no child items, execute the command (if any) and close the sidebar
      if (item.command) {
        item.command();
      }
      this.showSidebarSubject.next(false)
      this.activeNestedTab = null;
    }
  }

  openAbsentDialog(): void {
    this.dialogService.open(AbsentDialogComponent, {
      header:"Mark an Employee Absent"
    });
  }

}
