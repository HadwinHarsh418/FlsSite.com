import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClpsListingComponent } from './clps-listing/clps-listing.component';
import { CplsRoutingModule } from './clps.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule, TwoDecimal } from 'src/app/helpers/customPipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportDataModule } from '../import-data/import-data.module';
import { UserWithPermissionsModule } from '../users-with-permissions/users-permission.module';
import { ReviewClpItemComponent } from './review-clp-item/review-clp-item.component';
import { InfoClpsComponent } from './info-clps/info-clps.component';
import { ComponentsModule } from '../components/components.module';
import { ItemsModule } from '../items/items.module';


@NgModule({
  declarations: [
    ClpsListingComponent,
    ReviewClpItemComponent,
    InfoClpsComponent
  ],
  imports: [
    CommonModule,
    CplsRoutingModule,
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
    CheckboxModule,
    SharedModule,
    NgbModule,
    ImportDataModule,
    UserWithPermissionsModule,
    ComponentsModule,
    ItemsModule

  ]
})
export class ClpsModule { }
