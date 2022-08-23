import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-export-buttons',
  templateUrl: './export-buttons.component.html',
  styleUrls: ['./export-buttons.component.css']
})
export class ExportButtonsComponent implements OnInit {
  @Output() exportExcel: EventEmitter<any> = new EventEmitter();
  @Output() exportCsv: EventEmitter<any> = new EventEmitter();
  @Output() exportPdf: EventEmitter<any> = new EventEmitter();

  @Input() excelPermission:boolean = true;
  @Input() csvPermission:boolean = true;
  @Input() pdfPermission:boolean = true;
  
  @Input() toShowButtons:string[];  //'xlsx','csv','pdf'
  @Input() loadExlFile:boolean = false;
  @Input() loadCsvFile:boolean = false;
  @Input() loadPdfFile:boolean = false;

  @Input() btnClass:string = '';
  constructor() { }

  ngOnInit(): void {
    if(!this.toShowButtons) {
      this.toShowButtons = ['xlsx','csv','pdf'];
    }
  }

  emitExcel() {
    this.exportExcel.emit('xlsx');
  }
  emitCSV() {
    this.exportCsv.emit('csv');
  }
  emitPDF() {
    this.exportPdf.emit('pdf');
  }

}
