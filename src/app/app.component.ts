import { CommonModule } from '@angular/common';
import { Component,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showSidebar = false;
  constructor() {}
  toggleSideBar(){
    this.showSidebar = !this.showSidebar
  }
}