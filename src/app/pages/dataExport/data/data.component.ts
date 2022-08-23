import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MessageService } from 'primeng/api';
import { Users } from 'src/app/models/users';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  isLoading: boolean;

  types = [
    { id: 1, type: 'Item' },
    { id: 2, type: 'CLP' },
    { id: 3, type: 'Category' },
    { id: 4, type: 'FTY' }
  ];
  selectedType: any = { id: 1, type: 'Item' };

  file: any;
  @ViewChild('file', { static: false }) fileupload: ElementRef;
  loadExlFile: boolean = false;
  user: Users;
  uploadStatus: {
    totalRows: 0,
    rowsInserted: 0,
    rowsNotInserted: 0
  }

  constructor(
    private itemService: ItemsService,
    private toastr: ToastrManager,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.tokenKey.user;
  }

  downloadCsv() {
    // window.open('assets/sample.csv', "_blank")
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    if (this.selectedType.type == 'CLP') {
      link.href = 'assets/CLP-SAMPLE.xlsx';
      link.download = 'CLP-SAMPLE.xlsx';
    }
    else if (this.selectedType.type == 'Category') {
      link.href = 'assets/CATEGORY_SAMPLE.xlsx';
      link.download = 'CATEGORY_SAMPLE.xlsx';
    }
    else {
      link.href = 'assets/FTY_SAMPLE.xlsx';
      link.download = 'FTY_SAMPLE.xlsx';
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  getExcel() {
    this.loadExlFile = true;
    this.itemService.downloadSampleExcel(this.user.userId).subscribe((res) => {
      this.loadExlFile = false;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      let a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `sample.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a)
      }, 100)
    }, err => {
      this.loadExlFile = false;
      this.toastr.errorToastr('Oops something went wrong')
    })
  }

  fileChange(file) {
    this.file = file.target.files[0];
    if (this.file != undefined && this.file != null) {
      var strFileName = this.getFileExtension1(this.file.name);
      if (strFileName != 'xlsx') {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select correct file format', life: 3000 });
        this.toastr.errorToastr('Please select correct file format');
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
      let type;
      if (this.selectedType.type == 'CLP') {
        type = 'clp';
      }
      else if (this.selectedType.type == 'Category') {
        type = 'category';
      }
      else if (this.selectedType.type == 'FTY') {
        type = 'fty';
      }
      else {
        type = 'item'
      }
      this.itemService.uploadExcel(formData, type).subscribe((res) => {
        if (res['statusCode'] == 200) {
          this.fileupload.nativeElement.value = "";
          this.file = undefined;
          this.uploadStatus = res.data;
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

  onChange(event) {
    this.selectedType = event.value;

  }

}
