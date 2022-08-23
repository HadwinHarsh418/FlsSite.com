import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomHttpInterceptor } from './services/CustomHttpInterceptor';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { DeletePopUpComponent } from './pages/delete-pop-up/delete-pop-up.component';
import { DataManagementModule } from './pages/data-management/data-management.module';
import { DataExportModule } from './pages/dataExport/data-export.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProfileModule } from './pages/profileSetting/profile.module';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UsersModule } from './pages/users/users.module';
import { ItemsModule } from './pages/items/items.module';
import { NoPermissionComponent } from './pages/no-permission/no-permission.component';
import { ClpsModule } from './pages/clps/clps.module';
import { DxPivotGridModule } from 'devextreme-angular';
import { UserWithPermissionsModule } from './pages/users-with-permissions/users-permission.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { AgGridModule } from 'ag-grid-angular';
import { AgGirdComponent } from './pages/items/ag-gird/ag-gird.component';
import { NgOtpInputModule } from 'ng-otp-input';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DeletePopUpComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    ResetPasswordComponent,
    NoPermissionComponent,
    AgGirdComponent,
    
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgbModule,
    DataManagementModule,
    DataExportModule,
    DragDropModule,
    ProfileModule,
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
    UsersModule,
    ItemsModule,
    ClpsModule,
    DxPivotGridModule,
    UserWithPermissionsModule,
    RecaptchaModule,
    AgGridModule.withComponents([]),
    NgOtpInputModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,

    },
    MessageService,
    ConfirmationService
  ],
  entryComponents: [
    DeletePopUpComponent
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
