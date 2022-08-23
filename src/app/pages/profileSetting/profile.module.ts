import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting/setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile.routing.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProfileComponent } from './profile/profile.component';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { RolesComponent } from './roles/roles.component';
import { AssignRolesComponent } from './assign-roles/assign-roles.component';
import { CheckboxModule } from 'primeng/checkbox';
import { LogsComponent } from './logs/logs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserWithPermissionsModule } from '../users-with-permissions/users-permission.module';
import { AccesslogsComponent } from './accesslogs/accesslogs.component';
import { SalesPermissionComponent } from './sales-permission/sales-permission.component';
import { SalesDetailPermissionComponent } from './sales-detail-permission/sales-detail-permission.component';
import { ItemsModule } from '../items/items.module';

@NgModule({
  declarations: [
    SettingComponent,
    ProfileComponent,
    RolesComponent,
    AssignRolesComponent,
    LogsComponent,
    AccesslogsComponent,
    SalesPermissionComponent,
    SalesDetailPermissionComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    FormsModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    PanelModule,
    CheckboxModule,
    NgbModule,
    UserWithPermissionsModule,
    ItemsModule
  ],
})
export class ProfileModule {}
