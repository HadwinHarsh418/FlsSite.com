import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
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
import { ItemsModule } from '../items.module';
import { Items } from 'src/app/models/items';
import { UserService } from '../../../services/user.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.css'],
})
export class SalesDetailsComponent implements OnInit {
  @ViewChild('dt', { static: false }) paginator: Table;
  user: Users;
  cpls: CLPS[];
  years: any = [];
  ym = [];
  selectedYears = [];
  paging:any;
  startFrom:number;
  Limit=20;
  items: Items;
  customers: Items[] = [];
  loading: boolean = false;
  editableObject: CLPS;
  clpsDialogue: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  date3: Date;
  uploadedFiles: any[] = [];
  isDisplay: boolean = true;
  selectFilter = '';
  isShown: boolean = false;
  isShow = false;
  searchItemNo: string = '';
  searchPoNo: string = '';
  searchShpTid: string = '';
  searchCust: string = '';
  searchExpShip: string = '';
  searchShipNo: string = '';
  searchOrder: string = '';
  searchCustNo: string;
  selectedDate = '';
  selectedMonths: { month: number; name: string }[] = [];
  months: any = [
    { month: 1, name: 'Jan' },
    { month: 2, name: 'Feb' },
    { month: 3, name: 'Mar' },
    { month: 4, name: 'Apr' },
    { month: 5, name: 'May' },
    { month: 6, name: 'Jun' },
    { month: 7, name: 'Jul' },
    { month: 8, name: 'Aug' },
    { month: 9, name: 'Sept' },
    { month: 10, name: 'Oct' },
    { month: 11, name: 'Nov' },
    { month: 12, name: 'Dec' },
  ];
  searchFields1: any[] = [];
  dateFields1: any[] = [];
  private _startDate: Date;
  private _endDate: Date;
  toShowPagination: boolean = false;
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canUpload: false,
    canSave: false,
  };
  dt = new Date();
  currentDate = this.dt.getDate() + '-' + (this.dt.getMonth() + 1) + '-' + this.dt.getFullYear();
  loadCsvFile: boolean = false;
  loadPdfFile: boolean = false;
  loadExlFile: boolean = false;
  btnText: string = 'Save';
  totalRecords: number = 0;
  page: Page = new Page();
  MAX_SIZE: number = 20;
  btnDisabled: boolean = false;
  private keyUpFxn = new Subject<any>();
  // searchStr: string = '';
  searchPo: string = '';
  cols: any[] = [];
  totalAmount: any = 0;
  totalCbm: number = 0;
  // loadExlFile: boolean;
  _selectedColumns: any[] = [];
  hide: boolean = false;
  selectedCols: any = [];
  colLength: number = 0;
  debounceApi = new Subject<any>();
  defaultColumnsPop: boolean;
  columnArr: any = [];
  loadingDefaultCol: boolean;
  // loadPdfFile: boolean = false;
  loadingShortCut: boolean;
  stCode: number = 0;
  uploadStatus: {
    totalRows: 0;
    rowsInserted: 0;
    rowsNotInserted: 0;
  };
  openExtraCol: boolean;
  hideUploadSec: boolean;
  isfirstLoad = true;
  actionBtn: boolean;
  rmColumn: boolean = false;
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
  // loadCsvFile: boolean;

  constructor(
    private service: Service,
    private itemService: ItemsService,
    private userService: UserService,
    private toastr: ToastrManager,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clpsService: ClpsService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService
  ) {
    this.setPage()
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();
    this.selectYear();
    this.getRegRepColumn();

    // this.getSalesDetails();
  }

  ngOnInit(): void {
    // this.getAllClps();
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(31),
      canEdit: this.permissionService.getPermissionStatus(33),
      canDelete: this.permissionService.getPermissionStatus(32),
      canUpload: this.permissionService.getPermissionStatus(39),
      canSave: this.permissionService.getPermissionStatus(43),
    };
    this.debounceApi.pipe(debounceTime(500)).subscribe((data) => {
      this.saveColumns(data);
    });

    this.debounceApi.pipe(debounceTime(500)).subscribe((data) => {
      this.saveColumns(data);
    });
  }


  getRegRepColumn() {
    this.dtMmgmtService.getRegRepAv().subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data) {
          this.rmColumn = res.data
        }
      }
    });
  }

  selectYear() {
    this.service.getYear().subscribe((res) => {
      this.years = []
      if (res.statusCode == 200) {
        res.data.forEach(element => {
          this.years.push({ year: element });

        });
        let yr = [];
        for (let i = 0; i < 2; i++) {
          yr.push(this.years[i]);
        }
        let currentdate = new Date();
        this.selectedYears = yr;
        let month = { month: currentdate.getMonth() + 1 };
        this.selectedYears = [{ year: currentdate.getFullYear() }, { year: currentdate.getFullYear() - 1 }];
        this.selectedMonths = this.months.filter((mn) => mn.month == month.month);
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
  getMonth(mth) {
    if (mth < 10) {
      mth = '0' + mth;
    }
    return mth;
  }


  updateTable(data = [], total = 0) {
    this.cpls = data;
    this.totalRecords = total;
    this.toShowPagination = this.totalRecords > 0;
  }
  getDate(dt: Date) {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  selcetYm() {
    if (this.selectedYears.length) {

      if (!this.selectedMonths.length) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please select atleast one Month',
          life: 3000,
        });
        return;
      }
    } else {
      if (this.selectedMonths.length) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please select atleast one Year',
          life: 3000,
        });
      }
    }
  }

  newSearch(event?: LazyLoadEvent) {
    if (this.isfirstLoad) {
      this.isfirstLoad = false;
      return;
    }
    let searchFields: any[] = [];

    this.ym = [];

    this.selcetYm()
    this.selectedYears.forEach(y => {
      this.selectedMonths.forEach(
        mn => {
          this.ym.push(y.year + '-' + this.getMonth(mn.month))
        }
      )
    })
    if (this.searchPoNo?.trim()) {
      searchFields.push({ fieldName: 'poNumber', fieldVal: this.searchPoNo });
    }
    if (this.searchCust?.trim()) {
      searchFields.push({ fieldName: 'customer', fieldVal: this.searchCust });
    }
    if (this.searchCustNo?.trim()) {
      searchFields.push({ fieldName: 'custId', fieldVal: this.searchCustNo });
    }
    if (this.searchItemNo?.trim()) {
      searchFields.push({ fieldName: 'itemNo', fieldVal: this.searchItemNo });
    }

    this.searchFields1 = searchFields

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
      otherVals: this.ym
    };

    this.loading = true;
    this.clpsService.getAllSalesDetails(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.pageNumber = res.pageNumber;
        this.paging.totalPages= res.totalPages;
        this.paging.totalElements = res.totalElements;
        this.paging.pageSize = res.size
        this.updateTable(res.data, res.totalElements);
        this.isShow = true;
        if (!this.cols.length) {
          let columnsArray = this.columnsHeader();
          this.cols = [];
          this._selectedColumns = this._selectedColumns.length > 0 ? this._selectedColumns : this.cols;
          let columnsRespose: any;
          if (!this.rmColumn) {
            columnsRespose = res.selectedCols.filter(cr => cr != 'regionalRep')
          }
          else {
            columnsRespose = res.selectedCols
          }
          if (res.selectedCols.length) {
            debugger
            this.selectedCols = columnsRespose;
            columnsRespose.forEach((element) => {
              columnsArray.forEach((cl) => {
                cl.isDisplay =
                  columnsRespose.findIndex((cp) => cp == cl.field) > -1;
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
  clearNew() {
    this.searchPoNo = '';
    this.searchOrder = '';
    this.searchCust = '';
    this.searchCustNo = '';
    this.searchItemNo = '';
    this.selectedDate = '';
    this.startDate = null;
    this.endDate = null;
    this.newSearch();
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }
  toggleStatus() {
    this.isShow = !this.isShow;
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


  columnsHeader() {
    let columns = [
      {
        isDisplay: false,
        field: 'customer',
        header: 'Customer',
        type: 'input',
      },
      { isDisplay: false, field: 'category', header: 'Category', type: 'text' },
      { isDisplay: false, field: 'itemNo', header: 'ItemNo', type: 'text' },
      {
        isDisplay: false,
        field: 'itemNumber',
        header: 'ItemNumber',
        type: 'number',
      },
      {
        isDisplay: false,
        field: 'itemDesc',
        header: 'ItemDesc',
        type: 'text',
        currency: false,
      },
      { isDisplay: false, field: 'caseQty', header: 'CaseQty', type: 'text', },
      {
        isDisplay: false,
        field: 'salesAmt',
        header: 'SalesAmt',
        type: 'input',
      },
      { isDisplay: false, field: 'year', header: 'Year', type: 'text' },
      { isDisplay: false, field: 'month', header: 'Month', type: 'date' },
      {
        isDisplay: false,
        field: 'transType',
        header: 'TransType',
        type: 'text',
      },
      {
        isDisplay: false,
        field: 'docNum',
        header: 'DocNum',
        type: 'text',

      },
      {
        isDisplay: false,
        field: 'poNumber',
        header: 'PoNumber',
        type: 'input',
      },



      // { isDisplay: false, field: 'broker', header: 'PO DATE', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'broker', header: 'Broker', type: 'input' },
      { isDisplay: false, field: 'brokerId', header: 'BrokerId', type: 'text' },

      // { isDisplay: true, field: 'loc', header: 'loc', type: 'text' },
      {
        isDisplay: false,
        field: 'categoryId',
        header: 'CategoryId',
        type: 'text',
      },
      { isDisplay: false, field: 'cube', header: 'Cube', type: 'text' },
      { isDisplay: false, field: 'custId', header: 'CustId', type: 'text' },



      { isDisplay: false, field: 'location', header: 'Location', type: 'text' },
      { isDisplay: false, field: 'natAccId', header: 'NatAccId', type: 'text' },

      {
        isDisplay: false,
        field: 'regionalRep',
        header: 'RegionalRep',
        type: 'input',
      },

      { isDisplay: false, field: 'shipVia', header: 'ShipVia', type: 'input' },
      {
        isDisplay: false,
        field: 'shipCity',
        header: 'ShipCity',
        type: 'input',
      },

      {
        isDisplay: false,
        field: 'shipState',
        header: 'ShipState',
        type: 'text',
      },
      // { isDisplay: false, field: 'shipVia', header: 'shipVia', type: 'text' },
      { isDisplay: false, field: 'subCat', header: 'SubCat', type: 'text' },
      // {
      //   isDisplay: false,
      //   field: 'totalCount',
      //   header: 'TotalCount',
      //   type: 'text',
      // },
      { isDisplay: false, field: 'tracking', header: 'Tracking', type: 'text' },


      {
        isDisplay: false,
        field: 'yearMonth',
        header: 'YearMonth',
        type: 'text',
      },

    ];

    if (!this.rmColumn) {
      let col = columns.filter(cl => cl.field != 'regionalRep')
      return col;
    }
    else
      return columns;
  }

  deleteProduct(clps: CLPS) {
    const nameCapitalized =
      clps.itemNo.charAt(0).toUpperCase() + clps.itemNo.slice(1);
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.clpsService.deleteClps(clps.id).subscribe((res) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.newSearch();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: res.message,
              life: 3000,
            });
          } else if (res.statusCode == 200 && res.data == 2) {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: res.message,
              life: 3000,
            });
          } else {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: res.message,
              life: 3000,
            });
          }
        });
      },
    });
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

  getSalesDetails(body: any) {
    this.loading = true;

    this.clpsService.getAllSalesDetails(body).subscribe((res: Response) => {
      if (res.statusCode == 200) {
      }
    });
  }

  hideDialog() {
    this.clpsDialogue = false;
    this.submitted = false;
    this.itemLoading = false;
    this.btnText = 'Save';
  }

  saveProduct() {
    this.submitted = true;
    if (
      this.editableObject.itemNo.trim() &&
      this.editableObject.fty.trim() &&
      this.editableObject.po.trim() &&
      this.editableObject.qty
    ) {
      this.itemLoading = true;
      let rrd;
      let erd;
      let poDate;
      let eta;
      let etd;
      if (this.editableObject.rrd) {
        rrd = `${this.editableObject.rrd.getFullYear()}-${this.editableObject.rrd.getMonth() + 1
          }-${this.editableObject.rrd.getDate()}`;
      }
      if (this.editableObject.erd) {
        erd = `${this.editableObject.erd.getFullYear()}-${this.editableObject.erd.getMonth() + 1
          }-${this.editableObject.erd.getDate()}`;
      }
      if (this.editableObject.poDate) {
        poDate = `${this.editableObject.poDate.getFullYear()}-${this.editableObject.poDate.getMonth() + 1
          }-${this.editableObject.poDate.getDate()}`;
      }
      if (this.editableObject.eta) {
        eta = `${this.editableObject.eta.getFullYear()}-${this.editableObject.eta.getMonth() + 1
          }-${this.editableObject.eta.getDate()}`;
      }
      if (this.editableObject.etd) {
        etd = `${this.editableObject.etd.getFullYear()}-${this.editableObject.etd.getMonth() + 1
          }-${this.editableObject.etd.getDate()}`;
      }

      let data = {
        id: this.editableObject.id ? this.editableObject.id : 0,
        shipId: this.editableObject.shipId,
        fty: this.editableObject.fty,
        po: this.editableObject.po,
        itemNo: this.editableObject.itemNo,
        rrd: rrd ? rrd : null,
        erd: erd ? erd : null,
        notes: this.editableObject.notes,
        cbmCtn: this.editableObject.cbmCtn,
        qty: this.editableObject.qty,
        cost: this.editableObject.cost,
        extCost: this.editableObject.extCost,
        cbm: this.editableObject.cbm,
        gwCtn: this.editableObject.gwCtn,
        gw: this.editableObject.gw,
        cntrNo: this.editableObject.cntrNo,
        clp: this.editableObject.clp,
        poDate: poDate ? poDate : null,
        eta: eta ? eta : null,
        etd: etd ? etd : null,
        loc: this.editableObject.loc,
        shipVia: this.editableObject.shipVia,
        poLine: this.editableObject.poLine,
        webId: this.editableObject.webId,
        orgPoQty: this.editableObject.orgPoQty,
        isParent: true,
        isVisible: true,
        splitQty: this.editableObject.splitQty,
        bk: this.editableObject.bk,
        cCost: this.editableObject.cCost,
        chgbk: this.editableObject.chgbk,
        consignee: this.editableObject.consignee,
        cont: this.editableObject.cont,
        cube: this.editableObject.cube,
        do: this.editableObject.do,
        extCube: this.editableObject.extCube,
        fdaDesc: this.editableObject.fdaDesc,
        gri: this.editableObject.gri,
        h: this.editableObject.h,
        htsCode: this.editableObject.htsCode,
        htsValue: this.editableObject.htsValue,
        l: this.editableObject.l,
        lb: this.editableObject.lb,
        logo: this.editableObject.logo,
        pcscs: this.editableObject.pcscs,
        tariffCode: this.editableObject.tariffCode,
        terminal: this.editableObject.terminal,
        usc: this.editableObject.usc,
        w: this.editableObject.w,
        userOperation: null,
      };
      if (this.editableObject.id) {
        this.clpsService.updateClps(data).subscribe(
          (response: Response) => {
            if (response.statusCode == 200 && response.data == 1) {
              this.submitted = false;
              this.clpsDialogue = false;
              this.itemLoading = false;
              this.editableObject = new CLPS();
              this.btnText = 'Save';
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: response.message,
                life: 3000,
              });
              this.newSearch();
            } else if (response.statusCode == 200 && response.data == -1) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: response.message,
                life: 3000,
              });
              this.itemLoading = false;
            } else if (response.statusCode == 400) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: response.message,
                life: 3000,
              });
              this.itemLoading = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Oops seomthing went wrong',
                life: 3000,
              });
            }
          },
          (error) => {
          }
        );
      } else {
        this.clpsService.addClps(data).subscribe(
          (response: Response) => {
            if (response.statusCode == 200) {
              this.submitted = false;
              this.clpsDialogue = false;
              this.itemLoading = false;
              this.editableObject = new CLPS();
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: response.message,
                life: 3000,
              });
              this.newSearch();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: response.message,
                life: 3000,
              });
              this.itemLoading = false;
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Oops seomthing went wrong',
              life: 3000,
            });
          }
        );
      }
    }
  }

  validateDec(key) {
    //getting key code of pressed key
    var keycode = key.which ? key.which : key.keyCode;
    //comparing pressed keycodes
    if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) {
      return false;
    } else {
      var parts = key.srcElement.value.split('.');
      if (parts.length > 1 && keycode == 46) return false;
      return true;
    }
  }

  splitQty(clp: CLPS, columnName) {
    if (columnName === 'splitQty') {
      clp.splitQty = clp.splitQty
        ? parseInt(clp.splitQty.toString())
        : clp.splitQty;
      let allQty = this.cpls.filter((fl) => fl.list_id == clp.list_id);
      let mainQty = allQty.filter((fl) => fl.isParent)[0];
      let chLngth = allQty.filter(
        (aq) => aq.list_id == mainQty.list_id && !aq.isParent
      );
      allQty.map((val) => {
        val.extCost = val.splitQty * val.cost;
        val.extCube = val.splitQty * val.cube;
        val.cbm = val.extCube / 35.315;
        val.isSplit = true;
        if (val.webId == '')
          val.webId = clp.po + '-' + clp.poLine + '-00' + (chLngth.length + 1);
      });
      let lastIndex =
        this.cpls.findIndex((x) => x.list_id == clp.list_id) +
        (allQty.length >= 1 ? allQty.length - 1 : 0);
      let totalQty = allQty.reduce((a, b) => (a += b.splitQty), 0);

      if (totalQty > mainQty.qty) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Split qty can not be greater than & equal its actual value',
          life: 3000,
        });
        return;
      } else if (totalQty < mainQty.qty) {
        let diff = mainQty.qty - totalQty;
        let newClp: CLPS = JSON.parse(JSON.stringify(clp));
        delete newClp.id;
        newClp.shipId = '';
        newClp.etd = null;
        newClp.eta = null;
        newClp.erd = null;
        newClp.rrd = null;
        newClp.splitQty = diff;
        newClp.isParent = false;
        newClp.poLine = '';
        newClp.qty = null;
        newClp.webId =
          clp.po + '-' + mainQty.poLine + '-00' + (chLngth.length + 2);
        newClp.extCost = diff * newClp.cost;
        newClp.extCube = diff * newClp.cube;
        newClp.splitFrom = clp.webId;
        newClp.cbm = (diff * newClp.cube) / 35.315;
        this.cpls.splice(lastIndex + 1, 0, newClp);
      } else if (totalQty == clp.qty) {
      }
    }
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
      // ids = this.cpls.reduce((a, b) => a += b.id + ',', '').split(',');
      // ids.splice(-1, 1);
      let body = {
        searchFields: this.searchFields1,
        dateFields: '',
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
        otherVals: this.ym
      }
      this.service.getPdf(body, type).subscribe((res) => {
        this.loadExlFile = false;
        this.loadCsvFile = false;
        this.loadPdfFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (type == 'xlsx') {
          a.download = `SalesDetail_report-${this.currentDate}.xlsx`;
        }
        else if (type == 'csv') {
          a.download = `SalesDetail_report-${this.currentDate}.csv`;
        }
        else
          a.download = `SalesDetail_report-${this.currentDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a)
        }, 100)
      }, (err) => {
        this.loadCsvFile = false;
        this.loadExlFile = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: ' Oops something went wrong',
          life: 3000,
        });
      }
      )
    }
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




  saveReorderedColumns(event: any) {
    this.save(event.columns);
  }

  onChange(event: any) {
    let selecteds = [];
    this.selectedColumns.forEach(item => { selecteds.push(item.field) })
    this.cols.map(item => item.isDisplay = selecteds.includes(item.field));
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
      pageName: 'SalesDetail',
      columns: valSelected,
    };
    this.debounceApi.next(dt);
  }

  saveColumns(dt) {
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
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



  openDefaultCol() {
    this.columnArr = [
      { id: 4, field: "customer", header: "Customer", isDisplay: false },
      { id: 3, field: "category", header: "Category", isDisplay: false },
      { isDisplay: false, field: 'itemNumber', header: 'ItemNumber' },
      { isDisplay: false, field: 'itemDesc', header: 'ItemDesc' },

      { isDisplay: false, field: 'caseQty', header: 'CaseQty' },
      { isDisplay: false, field: 'salesAmt', header: 'SalesAmt' },
      { isDisplay: false, field: 'year', header: 'Year' },
      { isDisplay: false, field: 'month', header: 'Month' },
      { isDisplay: false, field: 'transType', header: 'TransType' },
      { isDisplay: false, field: 'docNum', header: 'DocNum' },
      { isDisplay: false, field: 'poNumber', header: 'PoNumber' },

    ];
    this.defaultColumnsPop = true;
  }
  hideDefaultDialog() {
    this.defaultColumnsPop = false;
  }


  saveDefault() {
    this.loadingDefaultCol = true;
    let val = [];
    this.cols = [];
    this.columnArr.forEach((sc) => {
      val.push(sc.field);
    });
    let dt = {
      pageName: 'salesDetail',
      columns: val,
    };
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this._selectedColumns = [];
        this.newSearch();
        this.defaultColumnsPop = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'there should be atleast one column name', life: 3000 });
      }
      this.loadingDefaultCol = false;
    })


  }


  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('CLP').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    });
  }

  handler(event) {
    this.uploadStatus = event;
    if (this.uploadStatus) this.openExtraCol = true;
    this.newSearch();
  }
  hidewarningDialog() {
    this.openExtraCol = false;
  }
  pageChanged(e) {
    this.startFrom = null;
    this.startFrom = (e - 1) * this.Limit;
    this.paging.pageNumber = e-1;
    this.newSearch()
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.newSearch();
   }
}
