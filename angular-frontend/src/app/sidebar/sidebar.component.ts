// sidebar.component.ts
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AbsentFormComponent } from './absent-form.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    RouterOutlet,
  ],
})
export class SidebarComponent {
  fillerNav: any[] = [];

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.fillerNav = [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        command: () => {
          this.router.navigate(['/dashboard']);
        },
      },
      {
        label: 'Employees',
        icon: 'people',
        children: [
          {
            label: 'View Employees',
            icon: 'view_list',
            command: () => {
              this.router.navigate(['/employees']);
            },
          },
          {
            label: 'Mark Absent',
            icon: 'event',
            command: () => {
              this.openAbsentDialog();
            },
          },
        ],
      },
      {
        label: 'Settings',
        icon: 'settings',
        children: [
          {
            label: 'Users',
            icon: 'group',
            command: () => {
              this.router.navigate(['/users']);
            },
          },
        ],
      },
    ];
  }

  openAbsentDialog(): void {
    this.dialog.open(AbsentFormComponent, {
      width: "200px",
      height: "450px",
      disableClose: true
    });
  }
}
