import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageItemComponent } from './image-item/image-item.component';
import { ExportButtonsComponent } from './export-buttons/export-buttons.component';



@NgModule({
  declarations: [
    ImageItemComponent,
    ExportButtonsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ImageItemComponent,
    ExportButtonsComponent
  ],
  entryComponents:[
    ImageItemComponent
  ]
})
export class ComponentsModule { }
