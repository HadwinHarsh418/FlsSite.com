import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Page } from 'src/app/models/page';
import { UserService } from 'src/app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ItemsService } from 'src/app/services/items.service';
import { Items } from 'src/app/models/items';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from "primeng/api";
import { Users } from 'src/app/models/users';
import { DataManagementService } from 'src/app/services/data-management.service';


@Component({
  selector: 'app-accesslogs',
  templateUrl: './accesslogs.component.html',
  styleUrls: ['./accesslogs.component.css']
})
export class AccesslogsComponent implements OnInit {
  responsiveOptions: any;
  ItemsImgs: any[];
  activeImageIndex = 0;
  hide: boolean = false;
  _selectedColumns: any[] = [];
  loading: boolean = false;
  page: Page = new Page();
  user: Users;
  totalRecords: number = 0;
  customers: Items[] = [];
  colLength: number = 0;
  selectedCols: any = [];
  cols: any[] = [];
  loadingShortCut: boolean;
  stCode: number = 0;

  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;

  constructor(private userService: UserService,
    private toastr: ToastrManager,
    public ref: ChangeDetectorRef,
    private itemService: ItemsService,
    private messageService: MessageService,
    private dtMmgmtService: DataManagementService,
  ) {
    this.getShortCutStatus();
    this.setPage();
  }

  ngOnInit(): void {
    this.user = this.userService.tokenKey.user;

  }


  loadCustomers(event?: LazyLoadEvent) {
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
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
      userId: this.user.userId

    }

    this.itemService.getAllAccessLogs(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
        this.paging.pageSize = res.size
        this.paging.totalElements = res.totalElements;
        if (!this.cols.length) {
          this.cols = this.columnsHeader();
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

  columnsHeader() {
    this.cols = [];
    let columns = [
      { field: 'email', header: 'Email' },
      { field: 'clientIp', header: 'Client Ip' },
      { field: 'actionType', header: 'Action' },
      { field: 'webBrowser', header: 'Browser' },
      { field: 'actionStatus', header: 'Action Status' },
      { field: 'actionDateTime', header: 'Date Time', type: 'date', format: `MM/dd/yyyy hh:mm a`, data: true },
    ]
    return columns;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }




  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-settings',
      url: "/setting/access-logs",
      shortcutName: "Access logs",
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
    this.dtMmgmtService.getSortcutName('Access logs').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

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
