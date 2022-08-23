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
import { DataManagementService } from 'src/app/services/data-management.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';
import { ClpsService } from 'src/app/services/clps.service';
import { Users } from 'src/app/models/users';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
declare var $;

interface Location {
  loc: string
}

@Component({
  selector: 'app-review-clp-item',
  templateUrl: './review-clp-item.component.html',
  styleUrls: ['./review-clp-item.component.css']
})
export class ReviewClpItemComponent implements OnInit {
  url: string;
  page: Page = new Page();
  MAX_SIZE: number = 20;
  filter: string = '';
  loading: boolean = false;
  dt = new Date();
  currentDate = this.dt.getDate() + '-' + (this.dt.getMonth() + 1) + '-' + this.dt.getFullYear();
  isShown: boolean = true;

  totalRecords: number = 0;
  cols: any[] = [];
  customers: Items[] = [];
  representatives: Representative[];
  statuses: any[];
  activityValues: number[] = [0, 100];
  itemLoading: boolean;

  colLength: number = 0;
  selectedCols: any = [];
  ftys: FTY[];
  selectedFtys: FTY;
  user: Users;
  items: Items;
  responsiveOptions: any;
  hide: boolean = false;
  _selectedColumns: any[] = [];
  debounceApi = new Subject<any>();
  loadingShortCut: boolean;
  stCode: number = 0;
  actionBtn: boolean;
  duplicatePopUo: boolean;
  itemsDt: any = [];
  itemDetail: any;
  searchItemNo: string = '';
  searchLoc: string = '';
  private keyUpFxn = new Subject<any>();
  locations: Location[];
  selectedLoc: Location[];

  totalNumber :any;
  Limit =20;
  paging: any;
  startFrom: number;
  constructor(
    private userService: UserService,
    private toastr: ToastrManager,
    public ref: ChangeDetectorRef,
    private clpsService: ClpsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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

    this.keyUpFxn.pipe(
      debounceTime(1000)
    ).subscribe(searchTextValue => {
      if (searchTextValue && searchTextValue.val.trim())
        this.loadCustomers(null, searchTextValue);
    });
    this.getShortCutStatus();
    this.setPage();
  }


  ngOnInit(): void {

    this.page.pageNumber = 0;
    this.page.size = this.MAX_SIZE;
    this.debounceApi.pipe(
      debounceTime(500)
    ).subscribe(data => {
      this.saveColumns(data);
    });

    this.getAllLoc();

  }


  getAllLoc() {
    this.clpsService.getAllCLPLocation().subscribe((res) => {
      if (res.statusCode == 200) {
        this.locations = res.data;
      }
    })

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  loadCustomers(event?: LazyLoadEvent, val?, loc?) {
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let searchColumn = '';
    let searchVal = '';
    let ft = {};
    if (val && val.val) {
      let strVal = val.val.split(',')
      // searchVal = strVal.filter(word => word.trim().length > 0);
      searchVal = val.val;
      searchColumn = val.type;
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
      searchCol: searchColumn,
      searchVal: searchVal,
      locations: (loc && loc.length) ? loc : []

    }

    this.clpsService.getAllReviewClpItem(body).subscribe((res) => {
      if (res.statusCode == 200) {

        this.paging.pageNumber = res.pageNumber;
            this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        if (!this.cols.length) {
          this.cols = [
            { isDisplay: false, field: 'itemNo', header: 'ITEM NO.' },
            { isDisplay: false, field: 'loc', header: 'LOC' },
            { isDisplay: false, field: 'itPo', header: 'IT PO' },
            { isDisplay: false, field: 'po', header: 'PO' }
          ];
          this.colLength = this.cols.length;
        }
        this.customers = res.data;
        this.totalRecords = res.totalElements;
        this.loading = false;
      }
      else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!')
      }
    })

  }



  saveReorderedColumns(event: any) {
    console.warn(event.columns, this.cols, this._selectedColumns)
    // this.save(event.columns);
  }

  onChange(event: any) {
    // this.save(event.value);

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

    let dt = {
      pageName: "",
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


  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-write',
      url: "/clps/review-clp-items",
      shortcutName: "Review clp",
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
    this.dtMmgmtService.getSortcutName('Review clp').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }


  getAllDailyItemsOld(dt, type) {
    this.loading = true;
    this.itemDetail = dt;
    const body = {
      itemNo: dt.itemNo,
      loc: dt.loc
    }
    this.clpsService.getDataByItemId(body, type).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.itemsDt = res.data;
        if (this.itemsDt.length)
          this.duplicatePopUo = true;
        else
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No data found', life: 3000 });
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  hideDefaultDialog() {
    this.duplicatePopUo = false;
    this.itemDetail = null;
  }

  search(type) {
    let stringVal = ''
    if (type == 'itemNo') {
      stringVal = this.searchItemNo;
      this.searchLoc = '';
    }
    else if (type == 'loc') {
      stringVal = this.searchLoc;
      this.searchItemNo = '';
    }
    let obj = { val: stringVal, type: type };
    if (!this.searchItemNo && !this.searchLoc) {
      this.loadCustomers(null, null)
    }
    else {
      this.keyUpFxn.next(obj);
    }
  }
  loadData() {
    if (!this.selectedLoc.length) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select atleast one location', life: 3000 });
      return
    }
    let dt = [];
    this.selectedLoc.forEach(element => {
      dt.push(element.loc)
    });
    this.loadCustomers(null, null, dt)

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
