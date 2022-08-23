import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MessageService } from 'primeng/api';
import { Users } from 'src/app/models/users';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.css']
})
export class ImportDataComponent implements OnInit {
  file: any;
  @ViewChild('file', { static: false }) fileupload: ElementRef;
  loadExlFile: boolean = false;
  user: Users;
  uploadStatus: {
    totalRows: 0,
    rowsInserted: 0,
    rowsNotInserted: 0
  }
  isLoading: boolean;
  @Input() type: string;
  @Output() result: any = new EventEmitter();
  openExtraCol: boolean = true;
  types = [
    { id: 1, type: 'XLSX' },
    { id: 2, type: 'CSV' },
  ];
  selectedType: any = { id: 1, type: 'XLSX' };
  constructor(
    private itemService: ItemsService,
    private toastr: ToastrManager,
    private messageService: MessageService,
    private userService: UserService,

  ) {
    this.user = this.userService.tokenKey.user;

  }

  ngOnInit(): void {
  }

  onChange(event) {
    this.selectedType = event.value;

  }
  downloadCsv() {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    if(this.selectedType.type == "XLSX"){
      this.itemService.downloadSampleExcel2(this.selectedType.type).subscribe((res) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `Item-sampleXLS.xlsx`;
        document.body.appendChild(a);
        a.click();
      })
    }else if(this.selectedType.type == "CSV"){
      this.itemService.downloadSampleExcel2(this.selectedType.type).subscribe((res) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `Item-sampleCSV.xlsx`;
        document.body.appendChild(a);
        a.click();
      })
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  fileChange(file) {
    this.file = file.target.files[0];
    if (this.file != undefined && this.file != null) {
      var strFileName = this.getFileExtension1(this.file.name);
      if (strFileName != 'xlsx' && strFileName != 'csv' && strFileName != 'xls') {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select correct file format', life: 3000 });
        // this.toastr.errorToastr('Please select correct file format');
        return;
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select .xlxs file', life: 3000 });
      return;
    }
  }
  uploadFile() {
    if (this.file) {
      const formData = new FormData();
      formData.append('formFile', this.file);
      this.isLoading = true;
      this.itemService.uploadExcel(formData, this.type).subscribe((res) => {
        if (res['statusCode'] == 200) {
          this.fileupload.nativeElement.value = "";
          this.file = undefined;
          this.uploadStatus = res.data;
          this.result.emit(this.uploadStatus);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });

        } else {
          this.fileupload.nativeElement.value = "";
          this.file = undefined;
          this.uploadStatus = res.data;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
        }
        this.isLoading = false;
      }, error => {
        this.fileupload.nativeElement.value = "";
        this.file = undefined;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
        this.isLoading = false;

      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select .xlxs file', life: 3000 });
    }
  }

  getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

}
