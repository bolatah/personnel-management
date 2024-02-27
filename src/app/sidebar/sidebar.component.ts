// sidebar.component.ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() showSidebar!: boolean;
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

  constructor(private router: Router) {
    this.showSidebar = false;
  }
  ngOnInit() {
    console.log(this.showSidebar)
    this.items = this.itemsArray;
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
      this.showSidebar = false;
      this.activeNestedTab = null;
    }
  }
}
