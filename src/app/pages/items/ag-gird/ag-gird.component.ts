import { ColDef } from 'ag-grid-community';
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
import { ImagesArr } from 'src/app/models/images';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
declare var $;

@Component({
  selector: 'app-ag-gird',
  templateUrl: './ag-gird.component.html',
  styleUrls: ['./ag-gird.component.css']
})
export class AgGirdComponent implements OnInit {
  customersData: any;
  // rowData: Observable<any[]>;
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
  ColDef:any[];
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canImportCsv: false,
    canImportPSD: false,
    canImportExl: false,
    canUpload: false
  }
  

  columnDefs: ColDef[]= [
    { field: 'cS_Upc', sortable: true, filter: true   },
    {field: 'color', sortable: true, filter: true },
    {field: 'cost', sortable: true, filter: true},
    { field: 'cube', sortable: true, filter: true},
    { field: 'description', sortable: true, filter: true },
    // { field: 'eA_Upc', sortable: true, filter: true },
    { field: 'h', sortable: true, filter: true },
    { field: 'hi', sortable: true, filter: true },
    // { field: 'htS_Code', sortable: true, filter: true },
    { field: 'itemNo', sortable: true, filter: true },
    { field: 'l', sortable: true, filter: true },
    { field: 'material', sortable: true, filter: true },
    { field: 'packing', sortable: true, filter: true },
    {field: 'plT_Qty', sortable: true, filter: true },
    { field: 'ti', sortable: true, filter: true},
    { field: 'totalCount', sortable: true, filter: true},
    { field: 'w', sortable: true, filter: true },
    {field: 'lb', sortable: true, filter: true },
    { field: 'id', sortable: true, filter: true },
    { field: 'gw', sortable: true, filter: true },
    // { field: 'matching_Lid', sortable: true, filter: true},
    { field: 'fkFtyId', sortable: true, filter: true },
    {field: 'fkCategoryId', sortable: true, filter: true },
    // { field: 'Action', sortable: true, filter: true },
    // { field: 'fdA_Desc', sortable: true, filter: true }

];
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
 
  constructor(
   
    private userService: UserService,
    private toastr: ToastrManager,
    public ref: ChangeDetectorRef,
    private itemService: ItemsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private permissionService: PermissionService,
  
  ) { 
    
    // this.rowData = this.http.post<any[]>('https://api.finelinesite.com/api/Items/GetAllItems');
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
      
    });
    
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
    this.loadCustomers();
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

 

  get pf() { return this.updatePersonalInfo.controls; }

  

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

 
  loadCustomers(event?: LazyLoadEvent) {
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
  
    const body = {
      size: this.page.size,
      page: this.page.pageNumber,
      filter: (event && event.globalFilter) ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      userId: this.user.userId

    }
    this.itemService.getAllItems(body).subscribe((res) => {
      if (res.statusCode == 200) {    
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
 

  load(event: LazyLoadEvent) {
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


}
