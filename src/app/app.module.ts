import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ConfirmationService, ContextMenuService, MessageService } from 'primeng/api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TabViewModule } from 'primeng/tabview';
import { InputMaskModule } from 'primeng/inputmask';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EmployeeCardComponent } from './employee-card/employee-card.component';
import { DynamicValidationDirective } from './dynamic-validation.directive';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserService } from './users/users-list/user.service';
import { UserListComponent } from './users/users-list/user-list.component';
import { ConvertEmployeeToUserComponent } from './users/user-form/user-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpcomingBirthdaysDialogComponent } from './dashboard/ birthday-dialog/birthday-dialog.component';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { AbsentDialogComponent } from './sidebar/absent-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EmployeeFormComponent,
    EmployeeListComponent,
    SidebarComponent, 
    ConfirmationDialogComponent, 
    EmployeeCardComponent, 
    DynamicValidationDirective,
    UserListComponent,
    ConvertEmployeeToUserComponent,
    UpcomingBirthdaysDialogComponent,
    AbsentDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FieldsetModule,
    TableModule, 
    ButtonModule, 
    SidebarModule,
    DropdownModule,
    MenuModule,
    ContextMenuModule,
    HttpClientModule, 
    TagModule, 
    FormsModule, 
    CalendarModule,
    CardModule, 
    DialogModule, 
    ToastModule, 
    ConfirmDialogModule,
    TabViewModule,
    MessageModule,
    MessagesModule, 
    InputMaskModule, 
    InputTextModule, 
    InputNumberModule, 
    MenubarModule,
    DropdownModule,
    TabMenuModule,
    PanelModule, 
   
    ChipModule,
  ],
  providers: [
    ContextMenuService, 
    DialogService, 
    MessageService,
    UserService,
    ConfirmationService,
    DynamicDialogRef,
    DynamicDialogConfig, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
