import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataColumn } from 'src/app/models/dataColumns';
import { DataManagementComponent } from './data-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataRoutingModule } from './data-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    DataManagementComponent
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    ToastModule
  ]
})
export class DataManagementModule { }
