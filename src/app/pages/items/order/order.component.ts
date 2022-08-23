import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ItemsService } from 'src/app/services/items.service';
import { element } from 'protractor';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';
import { CLPS } from 'src/app/models/clps';
import { Page } from 'src/app/models/page';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { ClpsService } from 'src/app/services/clps.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { PermissionService } from 'src/app/services/permission.service';
import { Service } from 'src/app/services/pivot.service';
import { PrimeNGConfig } from 'primeng/api';
import { Order } from '../../../models/orders';
import { Dialog } from 'primeng/dialog';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/services/user.service';

interface Date1 {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @ViewChild('pDialog') pdialog;
  @ViewChild('pDialog1') pdialog1;
  @ViewChild('pDialog2') pdialog2;
  @ViewChild('dt', { static: false }) paginator: Table;
  isShow = false;
  user: Users;
  date1: Date;
  searchFields: [];
  pickedSearch: any[] = [];
  filed: any[] = [];
  filterByStatus: any;
  statusOption = [
    { label: 'Order has a Shipment', value: 0 },
    { label: 'Does not have Shipment', value: 1 },
    { label: 'has all. This should be the default', value: 2 },
  ];
  es: any;
  selectedDate = '';
  selectFilter = '';
  toShowPagination: boolean = false;
  date2: Date;
  dates: Date[];
  invalidDates: Array<Date>;
  rangeDates: Date[];
  private _startDate: Date;
  private _endDate: Date;
  minDate: Date;
  hide: boolean = false;
  selectedOp: { op?: string };
  maxDate: Date;
  cpls: CLPS[];
  loading: boolean = false;
  editableObject: CLPS;
  clpsDialogue: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  date3: Date;
  uploadedFiles: any[] = [];
  isDisplay: boolean = true;
  selectedProducts: any[];
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canUpload: false,
    canSave: false,
    canImportCsv: false,
    canImportExl: false,
    canImportPSD: false,
  };
  dt = new Date();
  currentDate =
    this.dt.getDate() +
    '-' +
    (this.dt.getMonth() + 1) +
    '-' +
    this.dt.getFullYear();
  loadCsvFile: boolean = false;
  loadPdfFile: boolean = false;
  loadExlFile: boolean = false;
  btnText: string = 'Save';
  totalRecords: number = 0;
  page: Page = new Page();
  MAX_SIZE: number = 20;
  btnDisabled: boolean = false;
  private keyUpFxn = new Subject<any>();
  searchItemNo: string = '';
  searchPoNo: string = '';
  searchShpTid: string = '';
  searchCust: string = '';
  searchExpShip: string = '';
  searchShipNo: string = '';
  searchOrder: string = '';
  cust: any[];
  selectedNodes1: any[] = [];
  searchStatus: string = '';
  cols: any[] = [];
  totalAmount: any = 0;
  totalCbm: number = 0;
  _selectedColumns: any[] = [];
  selectedItems: CLPS[];
  selectedCols: any = [];
  colLength: number = 0;
  debounceApi = new Subject<any>();
  defaultColumnsPop: boolean;
  columnArr: any = [];
  loadingDefaultCol: boolean;
  loadingShortCut: boolean;
  stCode: number = 0;
  uploadStatus: {
    totalRows: 0;
    rowsInserted: 0;
    rowsNotInserted: 0;
  };
  openExtraCol: boolean;
  hideUploadSec: boolean;
  exStringDate: any;
  exString: any;
  exStr: any;
  actionBtn: boolean;
  product: any;
  productdetail: any;
  statDate: any;
  searchCustNo: string;
  item: any;
  eStr: string;
  columnsArray1: any[];
  exSt: string;
  filter: any;
  filterOptr: any;
  productdetail1: any;
  shipmentDetails1: any;
  value: any;
  orderNo: any;
  poNo: any;
  custNo: any;
  bilName: any;
  bilAddr1: any;
  bilAddr2: any;
  bilAddr3: any;
  bilCity: any;
  bilState: any;
  bilZip: any;
  shipName: any;
  shipAddr1: any;
  shipAddr2: any;
  shipAddr3: any;
  shipCity: any;
  shipState: any;
  shipZip: any;
  broker: any;
  searchFields1: any[] = [];
  dateFields1: any[] = [];
  sortDir1: any;
  sortCol1: any;
  gridFilters1: any;
  filter1: any;
  set startDate(date: Date) {
    this._startDate = date;
  }
  get startDate(): Date {
    return this._startDate;
  }

  set orderDate(date: Date) {
    this._startDate = date;
  }
  get orderDate(): Date {
    return this._startDate;
  }
  set endDate(date: Date) {
    this._endDate = date;
  }
  get endDate(): Date {
    return this._endDate;
  }

  set shipDate(date: Date) {
    this._startDate = date;
  }

  get shipDate(): Date {
    return this._startDate;
  }

  set expShipDate(date: Date) {
    this._endDate = date;
  }

  get expShipDate(): Date {
    return this._endDate;
  }

  isfirstLoad = true;

  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private service: Service,
    private userService: UserService,
    private toastr: ToastrManager,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clpsService: ClpsService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService
  ) {
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();
    this.setPage();
  }
  displayModal: boolean;

  displayBasic: boolean;

  displayBasic2: boolean;

  displayMaximizable: boolean;

  displayPosition: boolean;

  position: string;
  isShown: boolean = false; // hidden by default

  displayShipped: boolean;
  displayShimentDetails: boolean;

  shippedItems: any = [];
  pickedShipment: any = [];
  shipmentDetails: any = [];

  toggleShow() {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    let invalidDate = new Date();

    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(31),
      canEdit: this.permissionService.getPermissionStatus(33),
      canDelete: this.permissionService.getPermissionStatus(32),
      canUpload: this.permissionService.getPermissionStatus(39),
      canSave: this.permissionService.getPermissionStatus(43),
      canImportExl: this.permissionService.getPermissionStatus(19),
      canImportCsv: this.permissionService.getPermissionStatus(17),
      canImportPSD: this.permissionService.getPermissionStatus(18),
    };

    this.debounceApi.pipe(debounceTime(500)).subscribe((data) => {
      this.saveColumns(data);
    });
  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  showBasicDialog2() {
    this.displayBasic2 = true;
  }

  showMaximizableDialog() {
    this.displayMaximizable = true;
    close();
  }

  close() {
    window.close();
  }

  resetPosition() {
    if (this.pdialog) {
      this.pdialog.resetPosition();
    }
    if (this.pdialog1) {
      this.pdialog1.resetPosition();
    }
    if (this.pdialog2) {
      this.pdialog2.resetPosition();
    }
  }

  getMonth(mth) {
    if (mth < 10) {
      mth = '0' + mth;
    }
    return mth;
  }

  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-wallet',
      url: '/items-list/daily-clp-items',
      shortcutName: 'Daily CLP items',
    };
    this.loadingShortCut = true;
    this.dtMmgmtService.addToFav(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.loadingShortCut = false;
        this.getShortCutStatus();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
      } else {
        this.loadingShortCut = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Oops something went wrong',
          life: 3000,
        });
      }
    });
  }

  getmodeldata(orderId) {
    this.product = orderId;
    let Order = this.product.orderId;
    this.clpsService.getOrderdata(Order).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.productdetail = res.data;
        this.showMaximizableDialog();
      }
    });
    this.getSalesOrderItems({});
  }

  getSalesOrderItems(event?: LazyLoadEvent) {
  

    let body = {
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: event && event.sortOrder == 1 ? 'asc' : 'desc',
      sortCol: event && event.sortField,
      gridFilters: event && event.filters ? event.filters : {},
      getRecsBy: this.product.orderId,
    };
    this.clpsService.getOrderItems(body).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.productdetail1 = res.data;
      }
    });
  }

  getDate(dt: Date) {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  clearNew() {
    this.searchPoNo = '';
    this.searchOrder = '';
    this.searchCust = '';
    this.searchCustNo = '';
    this.searchItemNo = '';
    this.selectedDate = '';
    this.startDate = null;
    this.endDate = null;
  }
  columnsHeader() {
    let columns = [
      { isDisplay: false, field: 'orderNo', header: 'Order #', type: 'input' },
      {
        isDisplay: false,
        field: 'orderDate',
        header: 'Order Date',
        format: `MM/dd/yyyy`,
        data: true,
      },
      { isDisplay: false, field: 'poNo', header: 'PO #', type: 'input' },
      { isDisplay: false, field: 'custNo', header: 'Cust #', type: 'input' },
      {
        isDisplay: false,
        field: 'custName',
        header: 'Customer Name',
        type: 'input',
      },
      {
        isDisplay: false,
        field: 'expShipDate',
        header: 'ExShipDate',
        format: `MM/dd/yyyy`,
        data: true,
      },
      { isDisplay: false, field: 'loc', header: 'Loc', type: 'input' },
      {
        isDisplay: false,
        field: 'shipState',
        header: 'Ship State',
        type: 'input',
      },
    ];
    return columns;
  }

  newSearch(event?: LazyLoadEvent) {
    if (this.isfirstLoad) {
      this.isfirstLoad = false;
      return;
    }
    let searchFields: any[] = [];
    
    let dateFields: any[] = [];
    if (this.searchPoNo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPoNo });
    }
    if (this.searchOrder?.trim()) {
      searchFields.push({ fieldName: 'orderNo', fieldVal: this.searchOrder });
    }
    if (this.searchCust?.trim()) {
      searchFields.push({ fieldName: 'custName', fieldVal: this.searchCust });
    }
    if (this.searchCustNo?.trim()) {
      searchFields.push({ fieldName: 'custNo', fieldVal: this.searchCustNo });
    }
    if (this.searchItemNo?.trim()) {
      searchFields.push({ fieldName: 'itemNo', fieldVal: this.searchItemNo });
    }
    if (this.selectedDate) {
      if (this.startDate || this.endDate) {
        dateFields.push({
          fieldName: this.selectedDate,
          startDate: this.startDate ? this.getDate(this.startDate) : '',
          endDate: this.endDate ? this.getDate(this.endDate) : '',
        });
      }
    }
    this.searchFields1=searchFields
    this.dateFields1=dateFields
   
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;
    // } else {
    //   this.page.pageNumber = 0;
    //   this.page.size = this.page.size ? this.page.size : 50;
    //   this.paginator.reset();
    // }

    let body = {
      filterOptr: this.selectFilter,
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: event && event.sortOrder == 1 ? 'asc' : 'desc',
      sortCol: event && event.sortField,
      gridFilters: event && event.filters ? event.filters : {},
      searchFields: searchFields,
      dateFields: dateFields,
    };
   
    this.loading = true;
    this.clpsService.getAllOrder(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        this.updateTable(res.data, res.totalElements);
        this.isShow = true;
        if (!this.cols.length) {
          let columnsArray = this.columnsHeader();
          this.cols = [];
          this._selectedColumns =
            this._selectedColumns.length > 0
              ? this._selectedColumns
              : this.cols;
          if (res.selectedCols.length) {
            this.selectedCols = res.selectedCols;
            res.selectedCols.forEach((element) => {
              columnsArray.forEach((cl) => {
                cl.isDisplay =
                  res.selectedCols.findIndex((cp) => cp == cl.field) > -1;
                if (cl.field === element) {
                  this.cols.push(cl);
                }
              });
            });
            columnsArray.forEach((el) => {
              if (!el.isDisplay) {
                this.cols.push(el);
              }
            });
            this.selectedColumns = this.cols.filter((items) =>
              this.selectedCols.includes(items.field)
            );
            const newColumn = this.selectedColumns.filter(
              (item) => item.field != 'Action'
            );
            this.selectedColumns = newColumn;
            this.colLength = this.cols.length;
          }
        }
        this.totalRecords = res.totalElements;
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
      }
    });
  }

  updateTable(data = [], total = 0) {
    this.cpls = data;
    this.totalRecords = total;
    this.toShowPagination = this.totalRecords > 0;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  updateActionButtons() {
    let actionAvaile = this.selectedColumns.filter(
      (item) => item.field == 'Action'
    );
    if (actionAvaile.length) {
      const newColumn = this.selectedColumns.filter(
        (item) => item.field != 'Action'
      );
      this.selectedColumns = newColumn;
    } else {
      this.selectedColumns.push({
        currency: false,
        field: 'Action',
        header: 'Action',
        selectedCName: 'Action',
      });
    }
  }

  endAfterStart(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    return endDate.getTime() >= startDate.getTime();
  }

  openNew() {
    this.editableObject = new CLPS();
    this.submitted = false;
    this.clpsDialogue = true;
  }

  editProduct(clps: CLPS) {
    this.getFtyById(clps);
  }

  getFtyById(clps) {
    this.loading = true;
    this.clpsService.getClpsById(clps.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.btnText = 'Update';
        this.editableObject = res.data;
        this.editableObject.rrd = this.editableObject.rrd
          ? new Date(this.editableObject.rrd)
          : null;
        this.editableObject.erd = this.editableObject.erd
          ? new Date(this.editableObject.erd)
          : null;
        this.editableObject.poDate = this.editableObject.poDate
          ? new Date(this.editableObject.poDate)
          : null;
        this.clpsDialogue = true;
        this.loading = false;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Oops seomthing went wrong',
          life: 3000,
        });
      }
    });
  }

  getExcel(type) {
    
    if (this.cpls.length > 0) {
      let newClps = this.cpls.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }
      // let ids = [];
      // ids = this.cpls.reduce((a, b) => (a += b.id + ','), '').split(',');
      // ids.splice(-1, 1);

  let body={
  searchFields:this.searchFields1,
  dateFields:this.dateFields1,
  filterOptr: this.selectFilter,
  filter:  '',
  sortDir:  '',
  sortCol: '',
  gridFilters:  {},
  size: this.totalRecords,
  page: this.page.pageNumber,
}
      this.service.getPdf1(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `SalesOrder-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `SalesOrder-${this.currentDate}.csv`;
          } else a.download = `SalesOrder-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadCsvFile = false;
          this.loadExlFile = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: ' Oops something went wrong',
            life: 3000,
          });
        }
      );
    }
  }

  getExcelPop(type) {
    if (this.productdetail1.length > 0) {
      let newClp = this.productdetail1.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else {
        this.loadPdfFile = true;
      }
      let ids = [];
      ids = this.productdetail1

        .reduce((a, b) => (a += b.id + ','), '')
        .split(',');
      ids.splice(-1, 1);

      let body = {
        orderNo: this.productdetail.orderNo,
        orderDate: this.productdetail.orderDate,
        poNo: this.productdetail.poNo,
        custNo: this.productdetail.custNo,
        bilName: this.productdetail.bilName,
        bilAddr1: this.productdetail.bilAddr1,
        bilAddr2: this.productdetail.bilAddr2,
        bilAddr3: this.productdetail.bilAddr3,
        bilCity: this.productdetail.bilCity,
        bilState: this.productdetail.bilState,
        bilZip: this.productdetail.bilZip,
        shipName: this.productdetail.shipName,
        shipAddr1: this.productdetail.shipAddr1,
        shipAddr2: this.productdetail.shipAddr2,
        shipAddr3: this.productdetail.shipAddr3,
        shipCity: this.productdetail.shipCity,
        shipState: this.productdetail.shipState,
        shipZip: this.productdetail.shipZip,
        broker: this.productdetail.broker,
        ids:ids
      };
      this.service.getPdf2(type, body).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `SalesOrderItem_report-${this.currentDate}.xlsx`;
          } else a.download = `SalesOrderItem_report-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadPdfFile=false;
          this.loadCsvFile = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: ' Oops something went wrong',
            life: 3000,
          });
        }
      );
    }
  }
  getExcelPop2(type) {
    if (this.productdetail1.length > 0) {
      let newClp = this.productdetail1.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else{
        this.loadCsvFile = true;
      }
      
      let ids = [];
      ids = this.productdetail1

        .reduce((a, b) => (a += b.id + ','), '')
        .split(',');
      ids.splice(-1, 1);

     
      this.service.getPdfExcel(type, ids).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `SalesOrderItem_report-${this.currentDate}.xlsx`;
          } else a.download = `SalesOrderItem_report-${this.currentDate}.csv`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadExlFile=false;
          this.loadCsvFile = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: ' Oops something went wrong',
            life: 3000,
          });
        }
      );
    }
  }


  getExcelPop1(type) {
    if (this.shipmentDetails1.length > 0) {
      let newClp = this.shipmentDetails1.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else {
        this.loadPdfFile = true;
      }
      let ids = [];
      ids = this.shipmentDetails1
        .reduce((a, b) => (a += b.id + ','), '')
        .split(',');
      ids.splice(-1, 1);

      // let ship = this.item.shipId;

      let body = {
        shipId :this.item.shipId,
        bilState: this.productdetail.bilState,
        bilZip: this.productdetail.bilZip,
        shipNo: this.shipmentDetails.shipNo,
        orderNo: this.shipmentDetails.orderNo,
        poNo: this.shipmentDetails.poNo,
        invoiceNo: this.shipmentDetails.invoiceNo,
        shipDate: this.shipmentDetails.shipDate,
        shipVia: this.shipmentDetails.shipVia,
        trackingNo: this.shipmentDetails.trackingNo,
        bilName: this.productdetail.bilName,
        bilAddr1: this.productdetail.bilAddr1,
        bilAddr2: this.productdetail.bilAddr2,
        bilAddr3: this.productdetail.bilAddr3,
        shipName: this.productdetail.shipName,
        shipAddr1: this.productdetail.shipAddr1,
        shipAddr2: this.productdetail.shipAddr2,
        shipAddr3: this.productdetail.shipAddr3,
        shipCity: this.productdetail.shipCity,
        shipState: this.productdetail.shipState,
        shipZip:this.productdetail.shipZip,
        bilCity: this.productdetail.bilCity,
        ids: ids,
      };

      this.service.getPdf3(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `ShipmentDetailsItem_report-${this.currentDate}.xlsx`;
          } else
            a.download = `ShipmentDetailsItem_report-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadPdfFile=false;
          this.loadCsvFile = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: ' Oops something went wrong',
            life: 3000,
          });
        }
      );
    }
  }
  getExcelPop5(type) {
    if (this.shipmentDetails1.length > 0) {
      let newClp = this.shipmentDetails1.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else {
        this.loadCsvFile = true;
      }
      let ids = [];
      ids = this.shipmentDetails1
        .reduce((a, b) => (a += b.id + ','), '')
        .split(',');
      ids.splice(-1, 1);

      let ship = this.item.shipId;

      

      this.service.getPdfExport( type,ids, ship).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `ShipmentDetailsItem_report-${this.currentDate}.xlsx`;
          } else
            a.download = `ShipmentDetailsItem_report-${this.currentDate}.csv`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadExlFile=false;
          this.loadCsvFile = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: ' Oops something went wrong',
            life: 3000,
          });
        }
      );
    }
  }


  toggleStatus() {
    this.isShow = !this.isShow;
  }

  openDefaultCol() {
    this.columnArr = [
      { id: 1, field: 'orderNo', header: 'Order #', isDisplay: false },
      { id: 2, field: 'orderDate', header: 'Order Date', isDisplay: false },
      { id: 3, field: 'poNo', header: 'Po #', isDisplay: false },
      { id: 4, field: 'custNo', header: 'Cust #', isDisplay: false },
      { id: 5, field: 'custName', header: 'Cust Name', isDisplay: false },
      { id: 6, field: 'expShipDate', header: 'ExpShipDate', isDisplay: false },
      { id: 7, field: 'loc', header: 'Loc', isDisplay: false },
      { id: 8, field: 'shipState', header: 'Ship State', isDisplay: false },
    ];
    this.defaultColumnsPop = true;
  }

  saveDefault() {
    this.loadingDefaultCol = true;
    let val = [];
    this.cols = [];
    this.columnArr.forEach((sc) => {
      val.push(sc.field);
    });
    let dt = {
      pageName: 'SalesOrder',
      columns: val,
    };
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
        this._selectedColumns = [];
        this.newSearch();
        this.defaultColumnsPop = false;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'there should be atleast one column name',
          life: 3000,
        });
      }
      this.loadingDefaultCol = false;
    });
  }

  convertToDate(dt, printDate = false) {
    let date = new Date(dt);
    let d;
    let month;
    let day;
    if (dt) {
      month = '' + (date.getMonth() + 1);
      day = '' + date.getDate();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (printDate) d = `${month}/${day}/${date.getFullYear()}`;
      else d = `${date.getFullYear()}/${month}/${day}`;
    } else {
      d = null;
    }
    return d;
  }

  deleteRow(obj: CLPS) {
    let objInx = this.cpls.findIndex((fl) => fl.webId == obj.splitFrom);
    if (objInx == -1) {
      objInx = this.cpls.findIndex((fl) => fl.po == obj.po && fl.isParent);
    }
    if (objInx == 0) this.cpls[objInx].isSplit = false;
    this.cpls[objInx].splitQty += obj.splitQty;
    this.cpls[objInx].extCube = this.cpls[objInx].splitQty * obj.cube;
    this.cpls[objInx].extCost = this.cpls[objInx].splitQty * obj.cost;
    this.cpls[objInx].cbm = this.cpls[objInx].extCube / 35.315;

    const index = this.cpls.indexOf(obj);
    if (index > -1) {
      this.cpls.splice(index, 1);
    }
  }

  hideDefaultDialog() {
    this.defaultColumnsPop = false;
  }

  hideDialog() {
    this.clpsDialogue = false;
    this.submitted = false;
    this.itemLoading = false;
    this.selectedItems = [];
    this.selectedOp = null;
    this.btnText = 'Save';
  }

  saveReorderedColumns(event: any) {
    this.save(event.columns);
  }

  onChange(event: any) {
    let selecteds = [];
    this.selectedColumns.forEach((item) => {
      selecteds.push(item.field);
    });
    this.cols.map((item) => (item.isDisplay = selecteds.includes(item.field)));
    this.save(event.value);
  }

  save(selectedVals) {
    let unSelectedCols = this.cols.filter(
      (sl) => !this._selectedColumns.includes(sl)
    );
    let valSelected = [];
    let valUnSelected = [];
    selectedVals.forEach((sc) => {
      valSelected.push(sc.field);
    });
    unSelectedCols.forEach((sc) => {
      valUnSelected.push(sc.field);
    });

    let dt = {
      pageName: 'SalesOrder',
      columns: valSelected,
    };
    this.debounceApi.next(dt);
  }

  saveColumns(dt) {
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'there should be atleast one column name',
          life: 3000,
        });
      }
    });
  }

  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('CLP').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
      }
    });
  }

  loadShipments(item) {
    let Order = this.product.orderNo;
    this.clpsService.getOrderdata1(Order).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.shippedItems = res.data;
        this.pickedShipment = item;
        this.displayShipped = true;
      }
    });
  }

  loadShipmentDetails(item) {
    this.item = item;
    let Order = item.shipId;
    this.clpsService.getOrderdata2(Order).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.shipmentDetails = res.data;
        this.displayShimentDetails = true;
      }
    });
    this.loadShipmentsDetailsItem({});
  }

  loadShipmentsDetailsItem(event?: LazyLoadEvent) {
  
    let body = {
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: event && event.sortOrder == 1 ? 'asc' : 'desc',
      sortCol: event && event.sortField,
      gridFilters: event && event.filters ? event.filters : {},
      getRecsBy:this.item.shipId 
    };

    this.clpsService.getShipmentOrder(body).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.shipmentDetails1 = res.data;
      }
    });
  }

  empty() {
    return (
      !this.searchItemNo &&
      !this.searchPoNo &&
      !this.searchOrder &&
      !this.searchCustNo &&
      !this.searchCust &&
      !this.searchExpShip &&
      !this.startDate &&
      !this.endDate &&
      !this.expShipDate &&
      !this.shipDate &&
      !this.filed &&
      !this.pickedSearch
    );
  }
  vanishFilter() {
    this.searchItemNo = '';
    this.startDate = null;
    this.endDate = null;
    this.searchPoNo = '';
    this.searchCustNo = '';
    this.searchShipNo = '';
    this.searchCust = '';
    this.expShipDate = null;
    this.shipDate = null;
    this.searchOrder = '';
    this.filed = [];
    this.pickedSearch = [];
  }
  hidewarningDialog() {
    this.openExtraCol = false;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  getValue(value) {
    this.value = value;
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
    this.newSearch();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.newSearch();
}
}
