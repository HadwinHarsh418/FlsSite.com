import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import DxDataGrid from 'devextreme/ui/data_grid';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';

import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { ColDef } from 'ag-grid-community';
import { DxDataGridComponent } from 'devextreme-angular';

declare var $;

@Component({
  selector: 'app-ship-id-tracker-new',
  templateUrl: './ship-id-tracker-new.component.html',
  styleUrls: ['./ship-id-tracker-new.component.css'],
})
export class ShipIdTrackerNewComponent implements OnInit {
  colDefTab1: ColDef[] = this.getColumnDef(1);
  colDefTab2: ColDef[] = this.getColumnDef(2);
  colDefTab3: ColDef[] = this.getColumnDef(3);
  colDefTab4: ColDef[] = this.getColumnDef(4);
  colDefTab5: ColDef[] = this.getColumnDef(5);
  colDefTab6: ColDef[] = this.getColumnDef(6);
  colDefTab7: ColDef[] = this.getColumnDef(7);
  shipIdchanges: any[] = [];

  freightCost = [
    { name: '', id: '' },
    { name: 'Y', id: true },
    { name: 'N', id: false },
  ];

  selectLoc: string = '';
  startEditAction: string = 'dblClick';
  seachStr: string = '';
  deleteText: string = '';
  TabName: string = '';
  shipcount: any = '';
  hide: string = '';

  dt = new Date();
  currentDate =
    this.dt.getDate() +
    '-' +
    (this.dt.getMonth() + 1) +
    '-' +
    this.dt.getFullYear();

  actionBtn: boolean;
  loadingShortCut: boolean = false;
  loading: boolean = false;
  displayMaximizable = false;
  loadExlFile: boolean = false;
  loadCsvFile: boolean = false;
  loadPdfFile: boolean = false;
  submit: boolean = false;
  displayDetailData: Boolean = false;
  selectTextOnEditStart: boolean = false;
  deleteDialogue: boolean = false;
  itemLoading: boolean;
  defaultColumnsPop: boolean;
  showPageSizeSelector = true;
  showNavButtons = true;
  loader:boolean = false;

  paging: any;
  lastCountId: any;
  counterId: any;
  shipIdAll: any;
  history: any;
  chidRow: any;
  user: any;
  popu_Id: any;
  Booking: any;
  otw: any;
  ftyPayment: any;
  inBound: any;
  shipId: any;
  totalNumber: any;

  private keyUpFxn = new Subject<any>();

  currentTab = 1;

  cols2: any[] = [];
  Loc = [
    { country: 'CA' },
    { country: 'NY' },
    { country: 'CAD' },
    { country: 'NYD' },
    { country: 'IT' },
    { country: 'CIt' },
  ];

  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  stCode: number = 0;
  statusOption = [
    { label: 'All', value: 0 },
    { label: 'Open', value: 1 },
    { label: 'Completed', value: 2 },
  ];
  exportBody: { searchFields: { fieldName: string; fieldVal: any }[] };

  columnResizingMode: string;
  startDate: Date;
  endDate: Date;

  selectedDateType = '';
  columnChooserModes: any;
  allowSearch: boolean;
  readonly allowedPageSizes = [25, 50, 100, 200, 500];
  readonly displayModes = [
    { text: "Display Mode 'full'", value: 'full' },
    { text: "Display Mode 'compact'", value: 'compact' },
  ];
  displayMode = 'full';

  count: any[] = [];
  defaultData: { pageName: string; columns: any[] };
  selectedFtys: any[] = [];
  selectedStatus: any[] = [];
  selectedColumns: any[] = [];
  dataSource: any = [];
  ftydpw: any;
  status: any[] = [];
  defaultColumns = {};
  columnArr: ColDef[];
  startFrom: number;
  allowedColumns: any[] = [];

  @ViewChild('shipIDGrid', { static: false }) shipIDGrid: DxDataGridComponent;
  @ViewChild('pdialog') pdialog;
  childClpInfo: any[] = [];
  detailftyId: any;
  detailShipId: any;

  customizeColumns(columns) {
    columns[0].width = 70;
  }

  get isCompactMode() {
    return this.displayMode === 'compact';
  }
  constructor(
    private userService: UserService,
    private dtMmgmtService: DataManagementService,
    private messageService: MessageService,
    private http: HttpClient,
    private toastr: ToastrManager,
    private confirmationService: ConfirmationService,
    private itemServices: ItemsService,
    private permissionService: PermissionService,
    httpClient: HttpClient
  ) {
    this.allowedColumns = this.getColumnDef(this.currentTab);
    this.setAllDefault();
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();
    this.ftyitem();
    this.statusdpw();
    this.setPage();
    this.getAllTabStatus();
    this.allowSearch = true;
    this.columnChooserModes = [
      {
        key: 'dragAndDrop',
        name: 'Drag and drop',
      },
      {
        key: 'select',
        name: 'Select',
      },
    ];
  }
  getAllTabStatus() {
    this.itemServices.GetShIdTrackerTabsStats().subscribe((res) => {
      this.shipcount = res.data.shipId;
      this.Booking = res.data.booking;
      this.otw = res.data.otw;
      this.ftyPayment = res.data.ftyPayment;
      this.inBound = res.data.inbound;
      this.shipIdAll = res.data.shipIdAll;
      this.history = res.data.history;
    });
  }

  // pageChanged(event) {
  //   this.startFrom = (event - 1) * this.Limit;
  //   console.log(event)
  //   this.getDataGridTab1();
  // }

  setPage() {
    this.paging = {
      totalElements: 0,
      totalPages: 0,
      pageSize: 25,
      pageNumber: 0,
    };
  }
  ngOnInit(): void {
    this.keyUpFxn.pipe(debounceTime(500)).subscribe((searchTextValue) => {
      if (searchTextValue.trim()) this.getDataGridTab1(searchTextValue);
    });

    this.actions = {
      canEdit: this.permissionService.getPermissionStatus(82),
      canAdd: this.permissionService.getPermissionStatus(83),
      canDelete: this.permissionService.getPermissionStatus(84),
    };
  }

  getShortCutStatus() {
    this.dtMmgmtService
      .getSortcutName('ShipId Tracker')
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.stCode = res.data;
          // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        }
      });
  }
  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-settings',
      url: '/items-list/ship-id-new',
      shortcutName: 'ShipId Tracker',
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

  openDefaultCol() {
    this.defaultColumnsPop = true;
    this.columnArr = this.getColumnDef(this.currentTab, true);
  }
  closeModal() {
    this.defaultColumnsPop = false;
  }

  setAllDefault() {
    [1, 2, 3, 4, 5, 6, 7].forEach((tab) => {
      let columns = this.getColumnDef(tab, true);
      this.saveDefault(columns, tab, true);
    });
  }
  saveDefault(columns?: any, tab?: any, fromCustom?: boolean) {
    let val = [];
    if (columns && columns.length) {
      columns.forEach((sc) => {
        val.push(sc.field);
      });
    } else {
      this.columnArr.forEach((sc) => {
        val.push(sc.field);
      });
    }
    if ((tab == 1 && fromCustom) || (!fromCustom && this.currentTab == 1)) {
      this.defaultData = {
        pageName: 'ShIdTrak-ShipId',
        columns: val,
      };
    } else if (
      (tab == 2 && fromCustom) ||
      (!fromCustom && this.currentTab == 2)
    ) {
      this.defaultData = {
        pageName: 'ShIdTrak-Booking',
        columns: val,
      };
    } else if (
      (tab == 3 && fromCustom) ||
      (!fromCustom && this.currentTab == 3)
    ) {
      this.defaultData = {
        pageName: 'ShIdTrak-OTW',
        columns: val,
      };
    } else if (
      (tab == 4 && fromCustom) ||
      (!fromCustom && this.currentTab == 4)
    ) {
      this.defaultData = {
        pageName: 'ShIdTrak-FtyPayment',
        columns: val,
      };
    } else if (
      (tab == 5 && fromCustom) ||
      (!fromCustom && this.currentTab == 5)
    ) {
      this.defaultData = {
        pageName: 'ShIdTrak-Inbound',
        columns: val,
      };
    } else if (
      (tab == 6 && fromCustom) ||
      (!fromCustom && this.currentTab == 6)
    ) {
      this.defaultData = {
        pageName: 'ShIdTrak-ShipIdAll',
        columns: val,
      };
    } else if (
      (tab == 7 && fromCustom) ||
      (!fromCustom && this.currentTab == 7)
    ) {
      this.defaultData = {
        pageName: 'ShIdTrak-History',
        columns: val,
      };
    }
    this.dtMmgmtService.saveColumns(this.defaultData).subscribe((res) => {
      if (res.statusCode == 200) {
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        // this._selectedColumns = [];
        if (!fromCustom) {
          this.search();
        }
        this.defaultColumnsPop = false;
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
  onChange(e) {
    let fields = [];
    this.selectedColumns.forEach((item) => fields.push(item.field));
    const unique = [...new Set(fields)];

    let page =
      this.currentTab == 1
        ? 'ShIdTrak-ShipId'
        : this.currentTab == 2
        ? 'ShIdTrak-Booking'
        : this.currentTab == 3
        ? 'ShIdTrak-OTW'
        : this.currentTab == 4
        ? 'ShIdTrak-FtyPayment'
        : this.currentTab == 5
        ? 'ShIdTrak-Inbound'
        : this.currentTab == 6 ?
        'ShIdTrak-ShipIdAll' : 'ShIdTrak-History';
    this.defaultData = {
      pageName: page,
      columns: unique,
    };
    console.log(unique);
    this.dtMmgmtService.saveColumns(this.defaultData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.getDataGridTab1();
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
  changeTab(tab) {
    if (this.shipIdchanges.length) {
      this.alert(tab);
      return;
    }
    if (tab !== this.currentTab) {
      this.currentTab = tab;
      this.allowedColumns = this.getColumnDef(this.currentTab);
      this.statusdpw();
      this.clearNew(tab);
      this.dataSource = [];
      //this.clearAndGetNew();
    }
    this.startDate = null;
    this.endDate = null;
    this.selectedDateType = '';
    this.selectedFtys = [];
    this.selectedColumns = [];
    this.selectedStatus = [];
    this.setPage();
  }

  clearNew(tab?) {
    let tomakeCall = false;
    if (
      this.selectedFtys?.length ||
      this.selectedStatus?.length ||
      this.selectedDateType ||
      this.seachStr
    ) {
      tomakeCall = true;
    }
    this.selectedFtys = [];
    this.dataSource = [];
    this.selectedStatus = [];
    this.selectedDateType = '';
    this.seachStr = '';
    this.count = [];
    if (!tab && tomakeCall) this.getDataGridTab1();
  }

  closeAndSave(data) {
    this.displayMaximizable = false;
    this.selectLoc = null;
  }
  getDataGridTab1(val?) {
    let body = {
      pageSize: this.paging.pageSize,
      pageNo: this.paging.pageNumber,
      sortCol: '',
      sortDir: '',
      searchFields: [
        {
          fieldName: 'shipId',
          fieldVal: val ? val : 'null',
        },
      ],
    };
    if (!val) {
      body.searchFields = [];
    }
    if (this.selectedDateType) {
      body['dates'] = {
        fieldName: this.selectedDateType,
        startDate: this.startDate ? this.getDate(this.startDate) : null,
        endDate: this.endDate ? this.getDate(this.endDate) : null,
      };
    }
    if (this.selectedFtys.length) {
      let itemb = [];
      this.selectedFtys.forEach((fts) => {
        itemb.push(fts.fty);
      });
      body.searchFields.push({ fieldName: 'Fty', fieldVal: itemb.join(',') });
    }
    if (this.selectedStatus.length) {
      this.selectedStatus.forEach((st) => {
        body.searchFields.push({ fieldName: 'name', fieldVal: st.name });
      });
    }

    this.exportBody = body; 

    //http call here
    // if(this.currentTab < 5) {
    //   this.itemServices.getDataShipGridNewTab1(this.exportBody,this.currentTab).subscribe((res: any) => {
    //     this.dataSource = res.data;
    //     this.setPageData(res);
    //   })
    // } else {
    this.itemServices
      .getDataShipGridNewTab1(this.exportBody, this.currentTab)
      .subscribe((res: any) => {
        res.data.map((rm) => {
          if (!rm.bookingStatus) {
            rm.bookingStatus = '';
          }
        });
        this.dataSource = res.data;
        this.dataSource.map((item) => {
          item.shipIdD = [];
          item.fty.forEach((itm) => {
            let newtm = JSON.parse(JSON.stringify(item));
            newtm.fty = itm;
            item.shipIdD.push(newtm);
          });
        });
        this.setPageData(res);
      });
    // }
  }

  setPageData(res) {
    this.totalNumber = res.totalElements;
    console.log(this.totalNumber);
    this.paging = {
      totalElements: this.totalNumber,
      totalPages: res.totalPages,
      pageSize: this.paging.pageSize,
      pageNumber: res.pageNumber,
    };

    this.count = res.selectedCols;
    if (!this.selectedColumns.length) {
      if (this.count.length > 0) {
        let rot =
          this.currentTab == 1
            ? this.colDefTab1
            : this.currentTab == 2
            ? this.colDefTab2
            : this.currentTab == 3
            ? this.colDefTab3
            : this.currentTab == 4
            ? this.colDefTab4
            : this.currentTab == 5
            ? this.colDefTab5
            : this.currentTab == 6
            ? this.colDefTab6
            : this.colDefTab7;
        const unique = [...new Set(rot)];
        unique.forEach((dc) => {
          this.count.forEach((sc) => {
            if (dc.field == sc) {
              this.selectedColumns.push(dc);
            }
          });
        });
      }
    }
  }
  statusdpw() {
    if (this.currentTab == 1) {
      this.TabName = 'ShipId';
    } else if (this.currentTab == 2 || this.currentTab == 3 || this.currentTab == 5) {
      this.TabName = 'Booking';
    } else if (this.currentTab == 4) {
      this.TabName = 'fty';
    } else if (this.currentTab >= 6) {
      this.TabName = '';
    }
    this.itemServices.getBookingStatus(this.TabName).subscribe((res: any) => {
      this.status = [
        {
          name: '',
          id: null,
        },
      ].concat(res.data);
    });
  }

  ftyitem() {
    this.itemServices.getAllPlainFty().subscribe((res: any) => {
      this.ftydpw = res.data;
    });
  }
  search() {
    if (this.shipIdchanges.length) {
      this.alert(null);
      return;
    }
    if (!this.seachStr) {
      setTimeout(() => {
        this.getDataGridTab1();
      }, 500);
    } else {
      this.keyUpFxn.next(this.seachStr);
    }
  }

  deleteShipBtn = this.deleteShipId.bind(this);

  deleteShipId(e: any) {
    this.popu_Id = e.row.data.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the ' + e.row.data.shipId + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (e && e.event) {
          e.event.preventDefault();
          this.deleteDialogue = true;
        }
      },
    });
  }
  finalDelete() {
    if (this.deleteText.toLocaleLowerCase() == 'yes') {
      this.itemLoading = true;
      this.itemServices.DeleteShipId(this.popu_Id).subscribe((res: any) => {
        this.getDataGridTab1();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
      });
      this.itemLoading = false;
      this.deleteDialogue = false;
      this.popu_Id = '';
      this.deleteText = '';
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please enter YES ',
        life: 3000,
      });
    }
  }
  openNew() {
    this.displayMaximizable = true;
    this.selectLoc = '';
    this.shipId = '';
    this.itemServices.getShipIdCounter().subscribe((res: any) => {
      this.lastCountId = res.data;
    });
  }
  changeDd() {
    this.shipId = '';
    if (this.selectLoc) {
      let newID = this.lastCountId+1;
      this.shipId = this.selectLoc + newID;
      this.counterId = newID;
    }
  }
  generateShipid() {
    if (!this.shipId || !this.selectLoc) {
      return;
    }
    let data = {
      shipId: this.shipId,
      loc: this.selectLoc,
    };
    this.itemServices.createShipId(data).subscribe((res: any) => {
      if (!res.error) {
        this.displayMaximizable = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'SHIPID GENERATE SUCCESSFULLY',
          life: 3000,
        });
        this.getDataGridTab1();
        this.getAllTabStatus();
      } else {
        return;
      }
    });
    this.itemServices
      .getSaveShipIdCounter(this.counterId)
      .subscribe((res: any) => {
        this.lastCountId =this.counterId;
        console.log(res);
      });
  }

  hideDeleteDialog() {
    this.deleteDialogue = false;
    this.itemLoading = false;
    this.deleteText = '';
  }
  alert(tab) {
    this.confirmationService.confirm({
      message: 'Do you want to save the information?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        $('.dx-datagrid-save-button')[0].click();
        setTimeout(() => {
          if (tab) {
            this.shipIdchanges = [];
            this.changeTab(tab);
          } else {
            this.search();
          }
        }, 200);
      },
      reject: () => {
        $('.dx-datagrid-cancel-button').click();
        if (tab) {
          this.shipIdchanges = [];
          this.changeTab(tab);
        } else {
          this.search();
        }
      },
    });
  }

  onSaving(e?: any) {
    if (e.changes.length) {
      e.changes.forEach((dt) => {
        if (dt.data.hasOwnProperty('bookingStatus')) {
          let stObj = this.status.filter(
            (st) => st.name == dt.data.bookingStatus
          )[0];

          dt.data.bookingStatus = stObj.id;
        }
      });

      e.promise = this.updateGriddata(
        `${environment.url}ShipIdTracker/SaveShipIdTracker`,
        e.changes,
        e.component
      );
    }
  }

  async updateGriddata(
    url: string,
    changes: Array<{}>,
    component: DxDataGrid
  ): Promise<any> {
    await this.http
      .post(url, JSON.stringify(changes), {
        withCredentials: true,
      })
      .toPromise();
    await component.refresh(true);
    this.getDataGridTab1(this.seachStr);
    this.getAllTabStatus();
    component.cancelEditData();
  }
  getExceltabGeneral(type) {
    if (this.loadCsvFile || this.loadExlFile) {
      this.toastr.warningToastr('Please wait a file is already beind export');
      return;
    }
    if (!this.dataSource?.length || !['xlsx', 'csv'].includes(type)) {
      return;
    }
    if (type == 'xlsx') {
      this.loadExlFile = true;
    } else if (type == 'csv') {
      this.loadCsvFile = true;
    }

    let searchdata: any = this.exportBody;
    searchdata.totalElements = this.paging.totalElements;
    searchdata.pageSize = this.paging.totalElements;
    searchdata.pageNo = 0;
    let endpoint = '';
    switch (this.currentTab) {
      case 1:
        endpoint =
          type == 'xlsx'
            ? 'ShipIdTracker/ExportShipIdToExcel'
            : 'ShipIdTracker/ExportShipIdToCsv';
        break;
      case 2:
        endpoint =
          type == 'xlsx'
            ? 'ShipIdTracker/ExportBookingToExcel'
            : 'ShipIdTracker/ExportBookingToCsv';
        break;
      case 3:
        endpoint =
          type == 'xlsx'
            ? 'ShipIdTracker/ExportOTWToExcel'
            : 'ShipIdTracker/ExportOTWToCsv';
        break;
      case 4:
        endpoint =
          type == 'xlsx'
            ? 'ShipIdTracker/ExportFtyPaymentToExcel'
            : 'ShipIdTracker/ExportFtyPaymentToCsv';
        break;
      case 5:
        endpoint =
          type == 'xlsx'
            ? 'ShipIdTracker/ExportInboundToExcel'
            : 'ShipIdTracker/ExportInboundToCsv';
        break;
      case 6:
        endpoint =
          type == 'xlsx'
            ? 'ShipIdTracker/ExportShipIdAllToExcel'
            : 'ShipIdTracker/ExportShipIdAllToCsv';
        break;
    }

    this.itemServices.downloadExcelCSVShipTabs(endpoint, searchdata).subscribe(
      (res) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (type == 'xlsx') {
          a.download = `_report-${this.currentDate}.xlsx`;
        } else {
          a.download = `_report-${this.currentDate}.csv`;
        }
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      },
      (err) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        this.toastr.errorToastr('Oops something went wrong');
      }
    );
  }

  getExceltab1(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    } else {
      this.loadCsvFile = true;
    }
    let searchdata: any = this.exportBody;
    searchdata.totalElements = this.paging.totalElements;
    searchdata.pageSize = this.paging.totalElements;
    this.itemServices.downloadExcelForShipTab1(type, searchdata).subscribe(
      (res) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (type == 'xlsx') {
          a.download = `_report-${this.currentDate}.xlsx`;
        } else {
          a.download = `_report-${this.currentDate}.csv`;
        }
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      },
      (err) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        this.toastr.errorToastr('Oops something went wrong');
      }
    );
  }
  getExceltab2(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    } else {
      this.loadCsvFile = true;
    }
    this.itemServices.downloadExcelForShipTab2(type, this.exportBody).subscribe(
      (res) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (type == 'xlsx') {
          a.download = `_report-${this.currentDate}.xlsx`;
        } else {
          a.download = `_report-${this.currentDate}.csv`;
        }
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      },
      (err) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        this.toastr.errorToastr('Oops something went wrong');
      }
    );
  }
  getExceltab6(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    } else {
      this.loadCsvFile = true;
    }
    let searchdata: any = this.exportBody;
    searchdata.totalElements = this.paging.totalElements;
    searchdata.pageSize = this.paging.totalElements;
    this.itemServices.downloadExcelForShipTab6(type, searchdata).subscribe(
      (res) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (type == 'xlsx') {
          a.download = `_report-${this.currentDate}.xlsx`;
        } else {
          a.download = `_report-${this.currentDate}.csv`;
        }
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      },
      (err) => {
        this.loadExlFile = false;
        this.loadPdfFile = false;
        this.loadCsvFile = false;
        this.toastr.errorToastr('Oops something went wrong');
      }
    );
  }

  getDate(dt: Date) {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  getColumnDef(tab, tabDefult = false) {
    let allCol: ColDef[] = [
      /*0*/ {
        field: 'shipId',
        headerName: 'SHIPID',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*1*/ {
        field: 'rcp',
        headerName: 'RCP#',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*2*/ {
        field: 'loc',
        headerName: 'LOC',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*3*/ {
        field: 'fty',
        headerName: 'FTY',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*4*/ {
        field: 'rrd',
        headerName: 'RRD',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*5*/ {
        field: 'erd',
        headerName: 'ERD',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*6*/ {
        field: 'etd',
        headerName: 'ETD',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*7*/ {
        field: 'eta',
        headerName: 'ETA',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*8*/ {
        field: 'contDlvd',
        headerName: 'CONT DLVD',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*9*/ {
        field: 'contEmpty',
        headerName: 'CONT EMPTY',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*10*/ {
        field: 'contReturn',
        headerName: 'CONT RETURN',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*11*/ {
        field: 'bk',
        headerName: 'BK#',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*12*/ {
        field: 'shipVia',
        headerName: 'SHIP VIA',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*13*/ {
        field: 'qty',
        headerName: 'QTY',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*14*/ {
        field: 'extCube',
        headerName: 'EXT CUBE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*15*/ {
        field: 'arrivalNotice',
        headerName: 'ARRIVAL NOTICE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*16*/ {
        field: 'do',
        headerName: 'D/O',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*17*/ {
        field: 'freightCost',
        headerName: 'FREIGHT COST',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*18*/ {
        field: 'terminal',
        headerName: 'TERMINAL',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*19*/ {
        field: 'notes',
        headerName: 'NOTES',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*20*/ {
        field: 'forwarder',
        headerName: 'FORWARDER',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*21*/ {
        field: 'containerNo',
        headerName: 'CONT#',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*22*/ {
        field: 'uscDate',
        headerName: 'USC DATE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*23*/ {
        field: 'ftyPayment',
        headerName: 'FTY PAYMENT',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*24*/ {
        field: 'dueDate',
        headerName: 'DUE DATE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*25*/ {
        field: 'extCost',
        headerName: 'EXT COST',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*26*/ {
        field: 'generatedBy',
        headerName: 'CREATED BY',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*27*/ {
        field: 'generatedOn',
        headerName: 'CREATED ON',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*28*/ {
        field: 'lastUpdatedBy',
        headerName: 'LAST UPDATED BY',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*29*/ {
        field: 'lastUpdatedOn',
        headerName: 'LAST UPDATED ON',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*30*/ {
        field: 'bookingStatus',
        headerName: 'STATUS',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*31*/ {
        field: 'arrivalNotice',
        headerName: 'ARRIVAL NOTICE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*32*/ {
        field: 'invNumber',
        headerName: 'INV NUMBER',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*33*/ {
        field: 'source',
        headerName: 'SOURCE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*34*/ {
        field: 'rcpDate',
        headerName: 'RCP DATE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*35*/ {
        field: 'frtRelease',
        headerName: 'FRT RELEASE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*36*/ {
        field: 'uscRelease',
        headerName: 'USC RELEASE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*37*/ {
        field: 'puAppt',
        headerName: 'PU APPT',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*38*/ {
        field: 'dlvDate',
        headerName: 'DLV DATE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*39*/ {
        field: 'emptied',
        headerName: 'EMPTIED',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*40*/ {
        field: 'returned',
        headerName: 'RETURNED',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*41*/ {
        field: 'action',
        headerName: 'Action',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*42*/ {
        field: 'lcl',
        headerName: 'LCL',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*43*/ {
        field: 'pyDueDate',
        headerName: 'PY DUE DATE',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*44*/ {
        field: 'pyRef',
        headerName: 'PY REF',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*45*/ {
        field: 'includeFreight',
        headerName: 'INCLUDE FREIGHT',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*46*/ {
        field: 'total',
        headerName: 'TOTAL',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*47*/ {
        field: 'pol',
        headerName: 'POL',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*48*/ {
        field: 'mbl',
        headerName: 'MBL',
        editable: true,
        sortable: true,
        resizable: true,
      },
      /*49*/ {
        field: 'lfd',
        headerName: 'LFD',
        editable: true,
        sortable: true,
        resizable: true,
      },
    ];
    let allowedCols = {
      tab1: [0, 2, 3, 30, 26, 27, 28, 29],
      tab1Deafult: [0, 2, 3, 30],
      tab2: [
        0, 2, 3, 6, 7, 12, 13, 14, 17, 19, 20, 21, 22, 30, 35, 36, 42, 47, 48,
        26, 27, 28, 29,
      ],
      tab2Deafult: [
        0, 2, 3, 6, 7, 12, 13, 14, 17, 19, 20, 21, 22, 30, 35, 36, 42, 47, 48,
      ],
      tab3: [
        0, 2, 3, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 30,
        35, 36, 42, 47, 48, 26, 27, 28, 29,
      ],
      tab3Deafult: [
        0, 2, 3, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 30,
        35, 36, 42, 47, 48,
      ],
      tab4: [
        0, 2, 3, 6, 7, 17, 20, 24, 25, 30, 42, 43, 44, 45, 46, 26, 27, 28, 29,
      ],
      tab4Deafult: [0, 2, 3, 6, 7, 17, 20, 24, 25, 30, 42, 43, 44, 45, 46],
      tab5: [
        0, 1, 2, 3, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 30, 35, 36,
        37, 38, 39, 40, 47, 48, 49, 26, 27, 28, 29,
      ],
      tab5Deafult: [
        0, 1, 2, 3, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 30, 35,
        36, 37, 38, 39, 40, 47, 48, 49,
      ],
      tab6: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 24, 25, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45,
        46, 47, 48, 49, 26, 27, 28, 29,
      ],
      tab6Deafult: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 24, 25, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45,
        46, 47, 48, 49,
      ],
      tab7: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 24, 25, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46,
        47, 48, 49, 26, 27, 28, 29,
      ],
      tab7Deafult: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 24, 25, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45,
        46, 47, 48, 49,
      ],
    };
    let cols: ColDef[] = [];
    if (tabDefult) {
      allowedCols[`tab${tab}Deafult`].forEach((indx) => {
        cols.push(allCol[indx]);
      });
    } else {
      allowedCols[`tab${tab}`].forEach((indx) => {
        cols.push(allCol[indx]);
      });
    }
    return cols;
  }
  pageChanged(e) {
    this.startFrom = null;
    this.startFrom = e - 1;
    this.paging.pageNumber = e - 1;
    this.getDataGridTab1();
  }
  pageSizeChanged(e) {
    this.paging.pageSize = e;
    this.getDataGridTab1();
  }

  onSavingDetailRow(e?: any) {
    if (e.changes.length) {
      e.changes.forEach((dt) => {
        if (dt.data.hasOwnProperty('bookingStatus')) {
          let stObj = this.status.filter(
            (st) => st.name == dt.data.bookingStatus
          )[0];
          dt.data.bookingStatus = stObj.id;
        }
      });

      e.promise = this.updateGridDetailData(
        `${environment.url}ShipIdTrackerD/SaveShipIdTracker`,
        e.changes,
        e.component
      );
    }
  }

  async updateGridDetailData(
    url: string,
    changes: Array<{}>,
    component: DxDataGrid
  ): Promise<any> {
    await this.http
      .post(url, JSON.stringify(changes), {
        withCredentials: true,
      })
      .toPromise();
    await component.refresh(true);
    this.getDataGridTab1();
    this.getAllTabStatus();
    component.cancelEditData();
  }
  onCancel() {
    this.displayDetailData = false;
    this.childClpInfo = [];
  }
  resetPosition() {
    if (this.pdialog) {
      this.pdialog.maximize();
      this.pdialog.resetPosition();
    }
  }
  detaildata(shipId, fty) {
    this.detailShipId = {
      shipId: shipId,
      fty: fty && fty.length ? fty[0] : '',
    };
    this.displayDetailData = true;
    this.loader = true;
    this.itemServices.getClpInfoByShipId(this.detailShipId).subscribe((res: any) => {
        this.childClpInfo = res.data;
        this.loader = false;
      });

  }
}
