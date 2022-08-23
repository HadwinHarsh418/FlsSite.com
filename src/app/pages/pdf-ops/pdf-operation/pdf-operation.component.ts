import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Subject, Subscription } from 'rxjs';
import { Response } from 'src/app/models/response';
import { ItemsService } from 'src/app/services/items.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { PDFDocumentProxy, PdfViewerComponent } from 'ng2-pdf-viewer';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
declare var $;
@Component({
  selector: 'app-pdf-operation',
  templateUrl: './pdf-operation.component.html',
  styleUrls: ['./pdf-operation.component.css']
})
export class PdfOperationComponent implements OnInit {
  uploadedFiles: any[] = [];
  loadingRes: boolean;
  @ViewChild('fileInput') fileInput: FileUpload
  @ViewChild('fileInputmerge') fileInputmerge: FileUpload
  @ViewChild('fileDropRef', { static: false }) fileDropRef: ElementRef;
  @ViewChild('PdfViewerComponent') private pdfComponent: PdfViewerComponent;

  submitted: boolean;
  pdfViewPoppup: boolean;
  pdfSrc: any;
  file: File;
  sortedArr: any[];
  sortingPopup: boolean;
  loadingDefaultCol: boolean;
  loadingFile: boolean;
  data:string='';
  splitSaveAs:any= '';
  splitLinks:any[] = [];
  files: any[] = [];
  subs = new Subscription();
  fileName: string = '';
  mergedUrl: any;
  prefix:string=''
  totalPages: number;
  pagesArray: { pageNum?: number; pageName?: string, exit: boolean }[] = [];
  public userQuestion: string;
  arrFileName = new Subject<string>();
  page: any;

  toPdfOptions = [
    { label: 'Excel to PDF', value: 'excel' , accept:'.csv, .xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'},
    { label: 'Word to PDF', value: 'word', accept:'.doc,.docx,.xml,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { label: 'JPG to PDF', value: 'jpg', accept:'.jpg, .jpeg' }
  ];

  fromPdfOptions = [
    { label: 'PDF to Excel', value: 'excel', accept:'application/pdf, .pdf'},
    { label: 'PDF to Word', value: 'word', accept:'application/pdf, .pdf' },
    { label: 'PDF to JPG', value: 'jpg', accept:'application/pdf, .pdf' }
  ];

  selectedToPdfOption:any = {label:'', value:'', accept:''};
  selectedFromPdfOption:any = {label:'', value:'', accept:''};
  pageName: string;
  inpVal: any;
  val1: string='';

  /**
   * on file drop handler
   */
  onFileDropped($event, type?) {
    this.prepareFilesList($event, type);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files, type?) {
    this.prepareFilesList(files, type);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.pagesArray = [];
    this.files.splice(index, 1);
    if (!this.files.length) {
      this.pdfSrc = null;
      this.fileDropRef.nativeElement.value = ''
    }

  }


  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  @ViewChildren('input') inputs: QueryList<ElementRef> //<--here declare our "inputs"

  constructor(
    private messageService: MessageService,
    private itemService: ItemsService,
    public dragulaService: DragulaService
  ) {
    this.dragulaService.createGroup("VAMPIRES", {
      // revertOnSpill: true,
    });

    this.subs.add(this.dragulaService.dropModel("VAMPIRES").subscribe(args => {
    }))

    this.arrFileName.pipe(
      debounceTime(1000))
      .subscribe(value => {
        this.restrictValue(value);
      });
  }

  restrictValue(value) {
    if (!value.pageName) { return }
    let dupValue = this.pagesArray.filter(cp => cp.pageName == value.pageName);
    if (dupValue.length > 1) {
      this.pagesArray.map(pg => {
        if (pg.pageNum === value.pageNum) {
          pg.pageName = '';
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'File name already exist.', life: 3000 });

        }
      })
    }
    this.pagechanging(value.pageNum)
  }
  pagechanging(page) {
    if(this.page !== page) {
      this.page = page.pageNum; // the page variable
    }
  }

  pChange(page) {
    if(this.page !== page) {
      this.focusElement(page - 1);
    }
  }


  focusElement(index: number) {
    const input = this.inputs.find((x, i) => i == index)
    if (input) {
      input.nativeElement.focus()
      // input.nativeElement.scrollIntoView();
      
    }
  }
onClick(pg){
 if(this.data){
    pg.prefix= this.data + '-'
    this.val1=pg.prefix

}
else{
  pg.prefix=''
}
  }
 
  

  changeValue(obj) {
  }

  ngOnInit(): void {
  }

  search(stringToSearch: any) {
    if(stringToSearch) {
      this.pdfComponent.pdfFindController.executeCommand('find', {
        caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: stringToSearch
      });
    }
  }

  previewFile(file) {
    var reader = new FileReader();
    reader.onloadend = (event: any) => { this.pdfSrc = event.target.result; }
    reader.readAsDataURL(file);
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  getFile(type, sort = false, saveas=false) {
    this.submitted = true;
    const formData = new FormData();
    let mergedFiles = [];
    let splitFile = [];
    let sortedArr = [];
    if (type == "merge") {
      if (!this.files.length) {
        // if (!this.fileInput.files.length) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select file.', life: 3000 });
        return;
      }
      for (let i = 0; i < this.files.length; i++) {
        formData.append('pdfs', this.files[i]);
      }
    }
    else if (type == "direct") {
      if (!this.files.length) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select file.', life: 3000 });
        return;
      }
      if (this.fileName.trim()) {
        formData.append('filename', this.fileName);
        for (let i = 0; i < this.files.length; i++) {
          formData.append('pdfs', this.files[i]);
        }
      }
      else
        return
    }
    else {
      if (!this.files.length) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select file.', life: 3000 });
        return;
      }

      if (this.pagesArray && this.pagesArray.length && type != 'auto-split') {
        if (!this.pagesArray[0].pageName) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please enter file name in first page', life: 3000 });
          return
        }
      }

      if(type != 'auto-split') {

        let newArr = [];
        let splicArr = []
  
  
        let valueArr = this.pagesArray.map(function (item) { return item.pageName });
        let nonEmpty = valueArr.filter(a => a)
        let isDuplicate = this.checkIfArrayIsUnique(nonEmpty);
        if (!isDuplicate && type != 'auto-split') {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Duplicate file name exist.', life: 3000 });
          return
        }
        this.pagesArray.map(e => { e.exit = false });
        splicArr = this.pagesArray.map(e => ({ ...e }))
        for (let i = 0; i <= this.pagesArray.length; i++) {
          if (!this.pagesArray[i].exit)
            if (!this.pagesArray[i]['pageName']) {
              splicArr[i].exit = true;
              splicArr.filter(f => f.pageNum != splicArr[i].pageNum)
            }
            else {
              this.pagesArray[i].exit = true;
              break;
            }
        }
  
        splicArr.forEach(p => {
          if (!p.exit) {
            if (p.pageName) {
              newArr.push({ fileName: this.val1+p.pageName, pages: [p.pageNum] })
            }
            else {
              let index = newArr.length - 1;
              newArr[index].pages.push(p.pageNum)
            }
          }
        })
        sortedArr = [];
        newArr.forEach(nw => {
          if (nw.pages.length == 1) {
            sortedArr.push({ filename: nw.fileName, startPage: nw.pages[0], endPage: nw.pages[0] })
          }
          else {
            sortedArr.push({ filename: nw.fileName, startPage: nw.pages[0], endPage: nw.pages[nw.pages.length - 1] })
          }
        })
  
        formData.append('splitDetail', JSON.stringify(sortedArr));
      }
      for (let i = 0; i < this.files.length; i++) {
        formData.append('pdfFile', this.files[i]);
      }
    }

    // return;

    this.loadingRes = true;
    this.itemService.getnewFile(formData, type, saveas).subscribe((res) => {
      this.loadingRes = false;
      if (type == 'split' || type == 'auto-split') {
        this.submitted = false;
        if (saveas) {
          // this.resetValueBtn();
          if(res.statusCode == 200 && res.data && res.data.length) {
            this.splitLinks = [];
            for(let i = 0; i < res.data.length; i++) {
              let fln = sortedArr[i] ? sortedArr[i].filename : `${type == 'auto-split' ? 'Shipment': 'FilesName'} `;
              this.splitLinks.push({filename:  fln , url: `${environment.imgUlr}/${res.data[i]}`})
              
            }
          }
          // this.donwloadSplitedFiles(this.splitLinks);
        } else {
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = `${ ( type=='auto-split' ) ? 'shipmentfiles' : 'splitfiles'}.zip`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a)
          }, 100)
        }
        
        this.files = [];
        this.pagesArray = [];
        this.data='';
        this.val1='';
        this.fileDropRef.nativeElement.value = ''
        this.pdfSrc = null;
      }
      else if (type == 'direct') {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `${this.fileName}.pdf`;
        this.submitted = false;
        this.files = [];
        this.fileName = '';
        this.pagesArray = [];
       
        this.fileDropRef.nativeElement.value = ''
        this.pdfSrc = null;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a)
        }, 100)
      }
      else {
        this.files = [];
        this.submitted = false;
        this.fileDropRef.nativeElement.value = ''
        window.open(environment.imgUlr + '/' + res.data, "_blank")
      }
      this.sortedArr = [];
      this.loadingFile = false;
      this.sortingPopup = false;
    }, err => {
      this.loadingRes = false;
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });

    })
  }

  donwloadSplitedFiles(files) { 
      function download_next(i) {
        if (i >= files.length) {
          return;
        }
        var a = document.createElement('a');
        a.href = files[i].url;
        a.target = '_parent';
        // Use a.download if available, it prevents plugins from opening.
        if ('download' in a) {
          a.download = files[i].filename;
        }
        // Add a to the doc for click to work.
        (document.body || document.documentElement).appendChild(a);
        if (a.click) {
          a.click(); // The click method is supported by most browsers.
        } else {
          $(a).click(); // Backup using jquery
        }
        // Delete the temporary link.
        a.parentNode.removeChild(a);
        // Download the next file with a small timeout. The timeout is necessary
        // for IE, which will otherwise only download the first file.
        setTimeout(function() {
          download_next(i + 1);
        }, 500);
      }
      // Initiate the first download.
      download_next(0);
  }


  checkIfArrayIsUnique(myArray) {
    return myArray.length === new Set(myArray).size;
  }
  removeFile(file: File, uploader: FileUpload) {
    const index = uploader.files.indexOf(file);
    uploader.remove(null, index);
  }


  viewPreview(file: File, uploader: FileUpload) {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
    var reader = new FileReader();
    reader.onloadend = (event: any) => { this.pdfSrc = event.target.result; }
    reader.readAsDataURL(file);
    // this.file = file;
    // this.pdfSrc = file.name
    this.pdfViewPoppup = true;
  }

  hideDefaultDialog() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    this.pdfViewPoppup = false;
  }


  showSortingPopup() {
    this.sortingPopup = true;
  }

  hideSortDialog() {
    this.sortingPopup = false;
    // this.sortedArr = [];
  }

  // inputValue: string = '';

  // addPrefix(event) {
  //   this.inputValue = 'data'
  // }

  onSelect(event) {
    this.sortedArr = [];
    if (event.currentFiles && event.currentFiles.length > 0) {
      event.currentFiles.forEach(fl => {
        this.sortedArr.push(fl.name)
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortedArr, event.previousIndex, event.currentIndex);
  }


  saveOrderGetfile(type) {
    this.loadingFile = true;
    this.getFile(type, true)

  }


  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 20;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>, type) {
    if (type == 'split' || type == 'auto-split') {
      if (this.files.length >= 1)
        return
      else {
        for (const item of files) {
          item.progress = 0;
          this.files.push(item);
        }
        if (this.files.length) {
          this.previewFile(this.files[0])
        }
        this.uploadFilesSimulator(0);
      }
    } else if(type == 'topdf') {
      for (const item of files) {
        let nameEx = item.name.split('.');
        if(nameEx.length > 0) {
          nameEx = nameEx[nameEx.length - 1];
          if(this.selectedToPdfOption.accept.indexOf(nameEx) > -1 || this.selectedToPdfOption.accept.indexOf(item.type) > -1) {
            item.progress = 0;
            this.files.push(item);
          }
        }
      }
      if(this.files.length > 0) {
        this.uploadFilesSimulator(0);
      }
    }  else if(type == 'frompdf') {
      for (const item of files) {
        let nameEx = item.name.split('.');
        if(nameEx.length > 0) {
          nameEx = nameEx[nameEx.length - 1];
          if(this.selectedFromPdfOption.accept.indexOf(nameEx) > -1 || this.selectedFromPdfOption.accept.indexOf(item.type) > -1) {
            item.progress = 0;
            this.files.push(item);
          }
        }
      }
      if(this.files.length > 0) {
        this.uploadFilesSimulator(0);
      }
    } else {
      for (const item of files) {
        item.progress = 0;
        this.files.push(item);
      }
      if (this.files.length) {
        this.previewFile(this.files[0])
      }
      this.uploadFilesSimulator(0);
    }

  }


  resetValue() {
    this.files = [];
    this.fileDropRef.nativeElement.value = ''
    this.pagesArray = [];
    this.pdfSrc = null;
    this.splitSaveAs = '';
    this.splitLinks = [];
  }
  resetValueBtn() {
    this.files = [];
    this.fileDropRef.nativeElement.value = ''
    this.submitted = false;
    this.fileName = '';
    this.pagesArray = [];
    this.pdfSrc = null;
    this.splitSaveAs = '';
    this.splitLinks = [];
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
    this.pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pagesArray.push({ pageNum: i, pageName: '', exit: false })
    }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
    this.dragulaService.destroy('VAMPIRES');
  }

  ontoPdfChange(event) {
    this.files = [];
  }

  submitToPdf() {
    this.loadingRes = true;
    let formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }
    formData.append('conversionType', this.selectedToPdfOption.value);

    this.itemService.getConvertedFilesToPdf(formData, this.selectedToPdfOption.value).subscribe(
      res => {
      const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = `convertedPdf.zip`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a)
          }, 100)
      this.loadingRes = false;  
      this.files = [];  
    }, error => {
      this.loadingRes = false;
    });
  }

  submitFromPdf() {
    this.loadingRes = true;
    let formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }
    formData.append('conversionType', this.selectedFromPdfOption.value);

    this.itemService.getConvertedFilesFromPdf(formData, this.selectedFromPdfOption.value).subscribe(
      res => {
      const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = `convertedPdf.zip`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a)
          }, 100)
      this.loadingRes = false;  
      this.files = [];  
    }, error => {
      this.loadingRes = false;
    });
  }

}
