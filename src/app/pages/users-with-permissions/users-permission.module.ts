import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { UsersWithPermissionsComponent } from './users-with-permissions.component';
import { CheckboxModule } from 'primeng/checkbox';
@NgModule({
    declarations: [
        UsersWithPermissionsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        ToastModule,
        DropdownModule,
        ToolbarModule,
        DialogModule,
        ButtonModule,
        CheckboxModule
    ],
    exports: [UsersWithPermissionsComponent]
})
export class UserWithPermissionsModule { }
