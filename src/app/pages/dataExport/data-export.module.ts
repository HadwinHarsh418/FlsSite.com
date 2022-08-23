import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data/data.component';
import { DataExportRoutingModule } from './data-export.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    DataComponent
  ],
  imports: [
    CommonModule,
    DataExportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ToastModule,
    DropdownModule

  ]
})
export class DataExportModule { }
