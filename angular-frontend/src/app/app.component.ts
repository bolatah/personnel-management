
import { Component,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [SidebarComponent],
})
export class AppComponent {
  constructor() {
  }
}