import { Component, enableProdMode, OnInit, ViewChild, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/models/page';
import { UserService } from 'src/app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ItemsService } from 'src/app/services/items.service';
import { Items } from 'src/app/models/items';
import { Representative } from 'src/app/models/customer';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { MessageService } from "primeng/api";
import { PermissionService } from 'src/app/services/permission.service';
import { Response } from 'src/app/models/response';
import { FTY } from 'src/app/models/fty';
import { Category } from 'src/app/models/category';
import { Users } from 'src/app/models/users';
import { FileUpload } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { ImagesArr } from 'src/app/models/images';
import { DataManagementService } from 'src/app/services/data-management.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
declare var $;

@Component({
  selector: 'app-items-listing',
  templateUrl: './items-listing.component.html',
  styleUrls: ['./items-listing.component.css'],
  providers: [MessageService]

})
export class ItemsListingComponent implements OnInit {

  customersData: any;
  shippersData: any;
  dataSource: any;
  url: string;
  masterDetailDataSource: any;
  showFilterRow = true;
  currentFilter: any;
  showHeaderFilter = true;
  openAddItemPopup: boolean;
  updatePersonalInfo: FormGroup;
  updatingData: boolean;
  submitted: boolean;
  requiredF:any[] = ['material','cost','packing','gw','itemNo','description','color','csUpc','eaUpc']
  users: any = [];
  page: Page = new Page();
  selectedCustomerId: string;
  selectedEmail: string;
  selectedFirstName: string;
  selectedLastName: string;
  selectedType: string;
  selectedAuthorityId: number;
  selectedWarehouseId: number;
  selectedIdNo: string;
  selectedPassportNo: string;
  selectedMobileNo: string;
  selectedUsername: string;
  MAX_SIZE: number = 20;
  filter: string = '';
  loading: boolean = false;
  editableObject: Items = new Items();
  btnTxt: string = 'Save';
  dt = new Date();
  currentDate = this.dt.getDate() + '-' + (this.dt.getMonth() + 1) + '-' + this.dt.getFullYear();
  loadCsvFile: boolean = false;
  loadPdfFile: boolean = false;
  loadExlFile: boolean = false;
  isShown: boolean = true;

  totalRecords: number = 0;
  cols: any[] = [];
  customers: Items[] = [];
  representatives: Representative[];
  statuses: any[];
  activityValues: number[] = [0, 100];
  ev: LazyLoadEvent;
  productDialog: boolean = false;
  itemLoading: boolean;

  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;

  uploadedFiles: any[] = [];
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canImportCsv: false,
    canImportPSD: false,
    canImportExl: false,
    canUpload: false
  }

  columnsArray: any = [
    { id: 1, rCName: "csUpc", selectedCName: "csUpc", column: "CSUPC", isDisplay: false },
    { id: 2, rCName: "color", selectedCName: "color", column: "COLOR", isDisplay: false },
    { id: 3, rCName: "cost", selectedCName: "cost", column: "COST", isDisplay: false, currency: true },
    { id: 4, rCName: "cube", selectedCName: "cube", column: "CUBE", isDisplay: false },
    { id: 5, rCName: "description", selectedCName: "description", column: "DESCRIPTION", isDisplay: false },
    { id: 6, rCName: "eaUpc", selectedCName: "eaUpc", column: "EAUPC", isDisplay: false },
    { id: 7, rCName: "fdaDesc", selectedCName: "fdaDesc", column: "FDAUPC", isDisplay: false },
    { id: 8, rCName: "h", selectedCName: "h", column: "H", isDisplay: false },
    { id: 9, rCName: "hi", selectedCName: "hi", column: "HI", isDisplay: false },
    { id: 10, rCName: "htsCode", selectedCName: "htsCode", column: "HTSCODE", isDisplay: false },
    { id: 11, rCName: "itemNo", selectedCName: "itemNo", column: "ITEM No.", isDisplay: false },
    { id: 12, rCName: "l", selectedCName: "l", column: "L" },
    { id: 13, rCName: "material", selectedCName: "material", column: "MATERIAL", isDisplay: false },
    { id: 14, rCName: "packing", selectedCName: "packing", column: "PACKING", isDisplay: false },
    { id: 15, rCName: "pltQty", selectedCName: "pltQty", column: "PTLQTY", isDisplay: false },
    { id: 16, rCName: "ti", selectedCName: "ti", column: "TI", isDisplay: false },
    // { id: 17, rCName: "totalCount", selectedCName: "totalCount", column: "TOTAL COUNT", isDisplay: false },
    { id: 18, rCName: "w", selectedCName: "w", column: "W", isDisplay: false },
    { id: 19, rCName: "lb", selectedCName: "lb", column: "LB", isDisplay: false },
    // { id: 20, rCName: "id", selectedCName: "id", column: "ID", isDisplay: false },
    { id: 21, rCName: "gw", selectedCName: "gw", column: "GramW", isDisplay: false },
    { id: 22, rCName: "matchingLid", selectedCName: "matchingLid", column: "MATCHING-LID", isDisplay: false },
    { id: 23, rCName: "ftyCode", selectedCName: "ftyCode", column: "FTY CODE", isDisplay: false },
    { id: 24, rCName: "category", selectedCName: "category", column: "CATEGORY", isDisplay: false },
    // { id: 25, rCName: "action", selectedCName: "action", column: "Action", isDisplay: false }

  ]
  colors: any = [
    "BLACK", "BLACK/CLEAR", "BLUE", "BO/GOLD TRIM", "BONE", "CLEAR", "GREEN", "ORANGE", "PURPLE", "RED", "SILVER", "WH/SV TRIM", "WHITE", "YELLOW"
  ]
  colLength: number = 0;
  selectedCols: any = [];
  ftys: FTY[];
  selectedFtys: FTY;
  categories: Category[];
  selectedCategory: Category;
  user: Users;
  deleteText: string = '';
  deleteDialogue: boolean = false;
  items: Items;
  @ViewChild('fileInput') fileInput: FileUpload
  galleryDialogue: boolean = false;
  responsiveOptions: any;
  ItemsImgs: any[];
  deletedImagesIds: ImagesArr[];
  activeImageIndex = 0;
  hide: boolean = false;
  _selectedColumns: any[] = [];
  debounceApi = new Subject<any>();
  columnArr: any;
  defaultColumnsPop: boolean;
  loadingDefaultCol: boolean;
  value = '123654';
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
  printData = new Items();
  loadingShortCut: boolean;
  stCode: number = 0;
  uploadStatus: {
    totalRows: 0,
    rowsInserted: 0,
    rowsNotInserted: 0
  }
  openExtraCol: boolean;
  hideUploadSec: boolean;
  actionBtn: boolean;
  noImg: boolean = false;
  toBulkUpload: boolean = false;
  bulkUploading: boolean = false;
  itemNo: string = '';
  ftyCode: string = '';
  category: string = '';

  constructor(
    private userService: UserService,
    private toastr: ToastrManager,
    public ref: ChangeDetectorRef,
    private itemService: ItemsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user = this.userService.tokenKey.user;
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.debounceApi.pipe(
      debounceTime(500)
    ).subscribe(data => {
      this.saveColumns(data);
    });
    this.getShortCutStatus();
    this.setPage();
  }


  ngOnInit(): void {

    this.page.pageNumber = 0;
    this.page.size = this.MAX_SIZE;
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(1),
      canEdit: this.permissionService.getPermissionStatus(2),
      canDelete: this.permissionService.getPermissionStatus(4),
      canImportCsv: this.permissionService.getPermissionStatus(17),
      canImportPSD: this.permissionService.getPermissionStatus(18),
      canImportExl: this.permissionService.getPermissionStatus(19),
      canUpload: this.permissionService.getPermissionStatus(38)

    }
    this.getAllFTYs();
    this.getAllCategories();
  }



  getAllFTYs() {
    this.loading = true;
    this.itemService.getAllPlainFty().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.ftys = res.data;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  getAllCategories() {
    this.loading = true;
    this.itemService.getAllCategories().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.categories = res.data;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  addFeild() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
    this.openAddItemPopup = true
  }
  closeAddField() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    this.editableObject = new Items();
    this.btnTxt = 'Add';
    this.submitted = false;
    this.openAddItemPopup = false
  }

  get pf() { return this.updatePersonalInfo.controls; }

  onSubmit(form) {
    this.submitted = true;
    if (this.updatePersonalInfo.invalid) {
      return;
    }
    else {
      this.updatingData = true;
      form.ti = form.id ? parseInt(form.ti) : 0;
      form.hi = form.hi ? parseInt(form.hi) : 0;
      form.PLTQty = form.PLTQty ? parseInt(form.PLTQty) : 0;
      form.totalCount = form.totalCount ? parseInt(form.totalCount) : 0;
      if (this.editableObject && this.editableObject.id) {
        this.itemService.updateItem(form, this.editableObject.id).subscribe((response: any) => {
          if (response) {
            this.submitted = false;
            this.toastr.successToastr("Details updated Successfully",);
            this.updatePersonalInfo.reset();
            this.closeAddField();
            this.loadCustomers();
          } else {
            this.toastr.errorToastr('Oops something went wrong');
          }
          this.updatingData = false;
        }, error => {
          this.updatingData = false;
        });
      }
      else {
        form.id = 0
        this.itemService.addItem(form).subscribe((response: any) => {
          if (response) {
            this.submitted = false;
            this.toastr.successToastr("Details added Successfully",);
            this.updatePersonalInfo.reset();
            this.closeAddField();
            this.loadCustomers();
          } else {
            this.toastr.errorToastr('Oops something went wrong');
          }
          this.updatingData = false;
        }, error => {
          this.updatingData = false;
        });
      }
    }
  }

  editUser(row: Items) {
    this.loading = true;
    this.itemService.getItemById(row.id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.editableObject = res.data;
        this.btnTxt = 'Update'
        this.loading = false;
        this.addFeild();
      }
      else {
        this.toastr.errorToastr('Oops someting went wrong!!')
      }
    })
  }

  getExcel(type) {
    if (type == 'Excel') {
      this.loadExlFile = true;
    }
    else if (type == 'PDF') {
      this.loadPdfFile = true;
    }
    else {
      this.loadCsvFile = true;
    }
    this.itemService.downloadExcel(type).subscribe((res) => {
      this.loadExlFile = false;
      this.loadPdfFile = false;
      this.loadCsvFile = false;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      let a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      if (type == 'Excel') {
        a.download = `Item_report-${this.currentDate}.xlsx`;
      }
      else if (type == 'PDF') {
        a.download = `Item_report-${this.currentDate}.pdf`;
      }
      else {
        a.download = `Item_report-${this.currentDate}.csv`;
      }
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a)
      }, 100)
    }, err => {
      this.loadExlFile = false;
      this.loadPdfFile = false;
      this.loadCsvFile = false;
      this.toastr.errorToastr('Oops something went wrong')
    })
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  validateDec(key) {
    //getting key code of pressed key
    var keycode = (key.which) ? key.which : key.keyCode;
    //comparing pressed keycodes
    if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) {
      return false;
    }
    else {
      var parts = key.srcElement.value.split('.');
      if (parts.length > 1 && keycode == 46)
        return false;
      return true;
    }
  }

  loadCustomers(event?: LazyLoadEvent) {
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};

    let searchFields: any[] = [];

    if (this.itemNo?.trim()) {
      searchFields.push({ fieldName: 'itemNo', fieldVal: this.itemNo });
    }
    if (this.ftyCode?.trim()) {
      searchFields.push({ fieldName: 'ftyCode', fieldVal: this.ftyCode });
    }
    if (this.category?.trim()) {
      searchFields.push({ fieldName: 'category', fieldVal: this.category });
    }
    
    if (event && event.globalFilter) params += '&filter=' + event.globalFilter;
    if (event && event.sortField) {
      srD = (event.sortOrder == 1) ? 'asc' : 'desc';
      srC = event.sortField;
    }
    if (event) {
      if (Object.keys(event.filters).length != 0 && event.filters.constructor === Object) {
        ft = event.filters
      }
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;

    // }
    // else {
    //   this.page.pageNumber = 0
    //   this.page.size = this.page.size ? this.page.size : 20;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: (event && event.globalFilter) ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      userId: this.user.userId,
      searchFields: searchFields,
    }
    this.itemService.getAllItems(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        // if (body.sortDir == '' && Object.keys(body.gridFilters).length == 0) {
        if (!this._selectedColumns.length) {
          this.cols = [];
          this._selectedColumns = (this._selectedColumns.length > 0) ? this._selectedColumns : this.cols;
          if (res.selectedCols.length) {
            this.selectedCols = res.selectedCols
            res.selectedCols.forEach(element => {
              this.columnsArray.forEach(cl => {
                cl.isDisplay = (res.selectedCols.findIndex(cp => cp == cl.selectedCName) > -1)
                if (cl.selectedCName === element) {
                  this.cols.push({ field: cl.rCName, header: cl.column, selectedCName: cl.selectedCName, currency: cl.selectedCName == 'Cost' ? true : false })
                }
              });
            });
            this.columnsArray.forEach(el => {
              if (!el.isDisplay) {
                this.cols.push({ field: el.rCName, header: el.column, selectedCName: el.selectedCName, currency: el.selectedCName == 'Cost' ? true : false })
              }

            });

            this.selectedColumns = this.cols.filter(items => this.selectedCols.includes(items.selectedCName))
            const newColumn = this.selectedColumns.filter(item => item.field != 'Action')
            this.selectedColumns = newColumn;
            this.colLength = this.cols.length;
          }
        }
        this.customers = res.data;
        this.customers.map(cs => {
          cs.photoUrl = '/assets/images/user.jpg';
        })
        this.totalRecords = res.totalElements;
        this.loading = false;
      }
      else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!')
      }
    })

  }

  clearNew(){
    this.itemNo = '';
    this.ftyCode = '';
    this.category = '';
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  updateActionButtons() {
    let actionAvaile = this.selectedColumns.filter(item => item.field == 'Action');
    if (actionAvaile.length) {
      const newColumn = this.selectedColumns.filter(item => item.field != 'Action')
      this.selectedColumns = newColumn;
    }
    else {
      this.selectedColumns.push({ currency: false, field: "Action", header: "Action", selectedCName: "Action" })
    }
  }
  openBulkUpload() {
    this.toBulkUpload = true;
  }

  hideBulkUpload() {
    this.toBulkUpload = false;
  }

  myUploader(event: any) {
    if (!this.bulkUploading && event && event.files && event.files[0]) {
      let formData = new FormData();
      for (let i = 0; i < event.files.length; i++) {
        formData.append('formFile', event.files[i]);
      }
      this.bulkUploading = true;
      this.itemService.uploadItemsImagesFromZip(formData).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.toastr.successToastr(response.message);
          this.hideBulkUpload();
        }
        this.bulkUploading = false;
      })
    }
  }


  load(event: LazyLoadEvent) {
  }
  openNew() {
    this.editableObject = new Items();
    this.submitted = false;
    this.productDialog = true;
  }

  openGallery(item: Items) {
    this.loading = true;
    this.getItemById(item, true);
  }

  closeImgModal() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    this.galleryDialogue = false
  }

  editProduct(item: Items) {
    this.getItemById(item);
    this.deletedImagesIds = []
  }



  getItemById(item: Items, showImg = false) {
    this.loading = true;
    this.itemService.getItemById(item.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.editableObject = { ...res.data }
        this.editableObject.imagesData.map(img => {
          img.image = environment.imgUlr + '/' + img.image;
        })
        let fty = this.ftys.filter(item => item.fty == this.editableObject.ftyCode)[0];
        let cat = this.categories.filter(c => c.category == this.editableObject.category)[0];
        this.selectedFtys = fty;
        this.selectedCategory = cat;
        if (showImg) {
          if (this.editableObject.imagesData.length > 0) {
            setTimeout(() => {
              $('.single-item.galleryPopup').slick({
                dots: true,
                infinite: true,
                speed: 500,
                fade: true,
                cssEase: 'linear'
              });
            }, 100);
            const body = document.getElementsByTagName('body')[0];
            body.classList.add('modal-open');
            this.galleryDialogue = true;
          }
          else {
            this.noImg = true
            // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'No images found for this ITEM', life: 3000 });
          }
        }
        else
          this.productDialog = true;
        this.loading = false;

      }
    })
  }


  deleteImg(obj: ImagesArr) {
    this.editableObject.imagesData = this.editableObject.imagesData.filter(img => img.imageId != obj.imageId);
    this.deletedImagesIds.push(obj)

  }

  hideDialog() {
    this.selectedFtys = undefined;
    this.productDialog = false;
    this.itemLoading = false;
    this.submitted = false;
  }

  deleteProduct(items: Items) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + items.itemNo + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.items = items;
        this.deleteDialogue = true
      }
    });
  }

  printProduct(item: Items) {
    if (!item.csUpc) {
      this.toastr.errorToastr('No CSUPC found to print label')
      return
    }
    this.printData = item;
    setTimeout(() => {
      var innerContents = document.getElementById('pdfTable').innerHTML;
      var popupWindow = window.open('', 'Print');

      popupWindow.document.write('<!DOCTYPE html><html><head><style type="text/css">@media print { body { -webkit-print-color-adjust: exact; } }</style><link rel="stylesheet" type="text/css" href="barcode.css" media="all" /></head><body> ' + innerContents + '</body></html>');
      setTimeout(() => {
        popupWindow.focus();
        popupWindow.print();
        popupWindow.close();
      }, 100);
    }, 200);

  }



  hideDeleteDialog() {
    this.deleteDialogue = false;
    this.submitted = false;
    this.itemLoading = false;
    this.deleteText = '';
  }

  finalDelete() {
    this.submitted = true;
    if (this.deleteText.toUpperCase() == 'YES') {
      this.itemLoading = true;
      this.itemService.deleteItem(this.items.id).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.submitted = false;
          this.deleteDialogue = false;
          this.itemLoading = false;
          this.deleteText = '';
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
          this.loadCustomers();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
          this.itemLoading = false;
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please enter YES ', life: 3000 });

    }
  }



  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  saveProduct() {
    this.submitted = true;
    let errored = false;
    this.requiredF.forEach(field => {
      if(!this.editableObject[field]) {
        errored = true;
        return;
      }
    })
    if( errored || !this.selectedFtys || !this.selectedCategory){
      return;
    }
    if (this.selectedFtys) {
      this.editableObject.fkFtyId = this.selectedFtys.id;
    }
    else {
      this.editableObject.fkFtyId = '';
    }
    this.editableObject.fkCategoryId = (this.selectedCategory) ? this.selectedCategory.id : '';

    const formData = new FormData();
    let data = { ...this.editableObject }
    delete data.imagesData;
    this.fileInput;
    for (let i = 0; i < this.fileInput.files.length; i++) {
      formData.append('images', this.fileInput.files[i]);
    }
    for (var key in data) {
      formData.append(key, data[key]);
    }
    if (this.editableObject.id) {
      for (let i = 0; i < this.deletedImagesIds.length; i++) {
        formData.append('deleteImgsIds', this.deletedImagesIds[i].imageId);
      }
    this.itemLoading = true;
      this.itemService.updateItem(formData, this.editableObject.id).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.submitted = false;
          this.productDialog = false;
          this.itemLoading = false;
          this.editableObject = new Items();
          this.selectedFtys = undefined;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
          this.loadCustomers();
        } else {
          this.itemLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
        }
      }, error => {

      });
    }
    else {
      this.itemService.addItem(formData).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.submitted = false;
          this.productDialog = false;
          this.itemLoading = false;
          this.selectedFtys = undefined;
          this.editableObject = new Items();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Created', life: 3000 });
          this.loadCustomers();
        } else {
          this.itemLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
        }
      }, error => {
        this.itemLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail:'Oops! Something went wrong, please try again later.', life: 2000 });

      });
    }


  }


  saveReorderedColumns(event: any) {
    console.warn(event.columns, this.cols, this._selectedColumns)
    this.save(event.columns);
  }

  onChange(event: any) {
    this.save(event.value);

  }

  save(selectedVals) {

    let unSelectedCols = this.cols.filter(sl => !this._selectedColumns.includes(sl));
    let valSelected = [];
    let valUnSelected = [];
    selectedVals.forEach(sc => {
      valSelected.push(sc.selectedCName);
    })
    unSelectedCols.forEach(sc => {
      valUnSelected.push(sc.selectedCName);
    })

    // let dt = {
    //   selectedCols: valSelected,
    //   unSelectedCols: valUnSelected,
    // }
    let dt = {
      pageName: "Items",
      columns: valSelected
    }
    this.debounceApi.next(dt);

  }

  saveColumns(dt) {
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'there should be atleast one column name', life: 3000 });
      }
    })
  }


  openDefaultCol() {
    this.columnArr = [
      { id: 24, rCName: "fkCategoryId", selectedCName: "category", column: "CATEGORY", isDisplay: false },
      { id: 23, rCName: "fkFtyId", selectedCName: "ftyCode", column: "FTY CODE", isDisplay: false },
      { id: 11, rCName: "itemNo", selectedCName: "itemNo", column: "ITEM No.", isDisplay: false },
      { id: 2, rCName: "color", selectedCName: "color", column: "COLOR", isDisplay: false },
      { id: 5, rCName: "description", selectedCName: "description", column: "DESCRIPTION", isDisplay: false },
      { id: 13, rCName: "material", selectedCName: "material", column: "MATERIAL", isDisplay: false },
      { id: 14, rCName: "packing", selectedCName: "packing", column: "PACKING", isDisplay: false },
      { id: 3, rCName: "cost", selectedCName: "cost", column: "COST", isDisplay: false },
      { id: 21, rCName: "gw", selectedCName: "gw", column: "GramW", isDisplay: false },
      { id: 15, rCName: "pltQty", selectedCName: "pltQty", column: "PTLQTY", isDisplay: false },
      { id: 22, rCName: "matchingLid", selectedCName: "matchingLid", column: "MATCHING-LID", isDisplay: false },
      { id: 4, rCName: "cube", selectedCName: "cube", column: "CUBE", isDisplay: false },
      { id: 25, rCName: "Action", selectedCName: "Action", column: "Action", isDisplay: false }
    ];
    this.defaultColumnsPop = true;
  }
  hideDefaultDialog() {
    this.defaultColumnsPop = false;
  }

  saveDefault() {
    this.loadingDefaultCol = true;
    let val = [];
    this.columnArr.forEach(sc => {
      val.push(sc.selectedCName);
    })
    let dt = {
      pageName: "Items",
      columns: val
    }
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this._selectedColumns = [];
        this.loadCustomers();
        this.defaultColumnsPop = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'there should be atleast one column name', life: 3000 });
      }
      this.loadingDefaultCol = false;
    })
  }


  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-write',
      url: "/items-list",
      shortcutName: "Items",
    }
    this.loadingShortCut = true;
    this.dtMmgmtService.addToFav(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.loadingShortCut = false;
        this.getShortCutStatus();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
      else {
        this.loadingShortCut = false;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
      }
    })

  }

  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('Items').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }

  handler(event) {
    this.uploadStatus = event
    if (this.uploadStatus)
      this.openExtraCol = true
    this.loadCustomers();
  }
  hidewarningDialog() {
    this.openExtraCol = false
  }

  hideNoImgDialogue() {
    this.noImg = false
  }

  setPage() {
    this.paging = {
      totalElements: 0,
      totalPages: 0,
      pageSize: 25,
      pageNumber: 0,
    }
  }
  pageChanged(e) {
    this.startFrom = null;
    this.startFrom = (e - 1) * this.Limit;
    this.paging.pageNumber = e-1;
    this.loadCustomers();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.loadCustomers(null);
}
}
