import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfOperationComponent } from './pdf-operation/pdf-operation.component';
import { PdfOpsRoutingModule } from './pdf.ops.routing.module';
import { ToastrModule } from 'ng6-toastr-notifications';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndDirective } from 'src/app/helpers/dnd.directive';
import { DragulaModule } from 'ng2-dragula';
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'src/app/helpers/customPipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    PdfOperationComponent,
    DndDirective
  ],
  imports: [
    CommonModule,
    PdfOpsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    NgbModule,
    InputTextModule,
    FileUploadModule,
    ToolbarModule,
    RadioButtonModule,
    PdfViewerModule,
    DragDropModule,
    DragulaModule.forRoot(),
    TabViewModule,
    SharedModule,
    DropdownModule

  ]
})
export class PdfOpsModule { }
