import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemsListingComponent } from './items-listing/items-listing.component';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FtyComponent } from './fty/fty.component';
import { CategoryComponent } from './category/category.component';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { PivotComponent } from './pivot/pivot.component';
import { DailyClpItemsComponent } from './daily-clp-items/daily-clp-items.component';
import { SharedModule, TwoDecimal } from 'src/app/helpers/customPipe';
import { PanelModule } from 'primeng/panel';
import { DxButtonModule, DxChartModule, DxCheckBoxModule, DxDataGridModule, DxPivotGridModule, DxSelectBoxModule, DxTagBoxModule, DxTemplateModule } from 'devextreme-angular';
import { FtyNotesComponent } from './fty-notes/fty-notes.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportDataModule } from '../import-data/import-data.module';
import { UserWithPermissionsModule } from '../users-with-permissions/users-permission.module';
import { PriceInquiryComponent } from './price-inquiry/price-inquiry.component';
import { PdInquiryComponent } from './pd-inquiry/pd-inquiry.component';
import { ComponentsModule } from '../components/components.module';
import { InventoryQueueComponent } from './inventory-queue/inventory-queue.component';
import { DirectivesModule } from 'src/app/helpers/directives.module';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { DemoGridComponent } from './demo-grid/demo-grid.component';
import { DemoApiComponent } from './demo-api/demo-api.component';
import { OrderComponent } from './order/order.component';
import { ChargeBackComponent } from './charge-back/charge-back.component';
import {BadgeModule} from 'primeng/badge';
import { ShipIdTrackerComponent } from './ship-id-tracker/ship-id-tracker.component';
import { ShipTrackerComponent } from 'src/app/pages/items/ship-tracker/ship-tracker.component';
import { AgGridModule } from 'ag-grid-angular';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationComponent } from './pagination/pagination.component';
import { ShipIdTrackerNewComponent } from './ship-id-tracker-new/ship-id-tracker-new.component';




@NgModule({
  declarations: [
    ItemsListingComponent,
    FtyComponent,
    CategoryComponent,
    PivotComponent,
    DailyClpItemsComponent,
    FtyNotesComponent,
    PriceInquiryComponent,
    PdInquiryComponent,
    InventoryQueueComponent,
    SalesDetailsComponent,
    DemoGridComponent,
    DemoApiComponent,
    OrderComponent,
    ChargeBackComponent,
    ShipIdTrackerComponent,
    ShipTrackerComponent,
    ShipIdTrackerNewComponent,
    PaginationComponent,
    // AgGirdComponent,
    
   
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ItemsRoutingModule,
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
    CarouselModule,
    CheckboxModule,
    SharedModule,
    PanelModule,
    DxPivotGridModule,
    DxChartModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    NgxBarcodeModule,
    DxButtonModule,
    NgbModule,
    ImportDataModule,
    UserWithPermissionsModule,
    DirectivesModule,
    BadgeModule,
    DxTagBoxModule,
    DxTemplateModule,
    AgGridModule,
    PaginatorModule

  ],
  exports:[
    PaginationComponent
  ]
})
export class ItemsModule { }
