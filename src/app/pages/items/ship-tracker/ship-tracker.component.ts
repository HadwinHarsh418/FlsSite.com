import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import DxDataGrid from 'devextreme/ui/data_grid';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';

import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { ColDef } from 'ag-grid-community';
import { dateFilter } from './filters';
import { AgDatePicker } from './components/ag-datepicker';

@Component({
  selector: 'app-ship-tracker',
  templateUrl: './ship-tracker.component.html',
  styleUrls: ['./ship-tracker.component.css']
})
export class ShipTrackerComponent implements OnInit {
  dataSource = [];
  ftydpw: any;
  status: any[] = []
  shipId: any;
  user: any;
  popu_Id: any;
  colDefTab1:ColDef[] = this.getColumnDef(1);
  colDefTab2:ColDef[] = this.getColumnDef(2);
  colDefTab3:ColDef[] = this.getColumnDef(3);
  colDefTab4:ColDef[] = this.getColumnDef(4);

  selectLoc: string = '';
  startEditAction: string = "dblClick";
  seachStr: string = ''
  deleteText: string = '';

  dt = new Date();
  currentDate = this.dt.getDate() + '-' + (this.dt.getMonth() + 1) + '-' + this.dt.getFullYear();


  actionBtn: boolean;
  loadingShortCut: boolean = false;
  loading: boolean = false;
  displayMaximizable = false;
  loadExlFile: boolean = false;
  loadCsvFile: boolean = false;
  loadPdfFile: boolean = false;
  submit: boolean = false;
  selectTextOnEditStart: boolean = false;
  deleteDialogue: boolean = false;
  itemLoading: boolean;

  private keyUpFxn = new Subject<any>();



  currentTab = 1;

  cols2: any[] = [];
  Loc = [
    { country: "CA" }, { country: "NY" }, { country: "CAD" }, { country: "NYD" }, { country: "IT" }, { country: "CIt" },

  ];



  actions = {
    canAdd: false,
    canEdit: false,
  }

  stCode: number = 0;
  statusOption = [{ label: 'All', value: 0 }, { label: 'Open', value: 1 }, { label: 'Completed', value: 2 }];
  exportBody: { searchFields: { fieldName: string; fieldVal: any; }[]; };
  constructor(
    private userService: UserService,
    private dtMmgmtService: DataManagementService,
    private messageService: MessageService,
    private http: HttpClient,
    private toastr: ToastrManager,
    private confirmationService: ConfirmationService,
    private itemServices: ItemsService,
    private permissionService: PermissionService,

  ) {
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();
    this.ftyitem();
    this.getDataGrid();
    this.statusdpw();
  }

  ngOnInit(): void {
    this.getDataGrid();
    this.keyUpFxn.pipe(
      debounceTime(500)
    ).subscribe(searchTextValue => {
      if (searchTextValue.trim())
        this.getDataGrid(searchTextValue);
    });

    this.actions = {
      canEdit: this.permissionService.getPermissionStatus(82),
      canAdd: this.permissionService.getPermissionStatus(83),
    }
  }

  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('SHIPID').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }
  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-money',
      url: "/items-list/ship-id",
      shortcutName: "SHIP ID TRACKER",
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

  changeTab(tab) {
    if (tab !== this.currentTab) {
      this.currentTab = tab;
      this.clearNew();
      //this.clearAndGetNew();
    }
  }

  clearNew() { }

  closeAndSave(data) {
    this.displayMaximizable = false;
    this.selectLoc = null;

  }

  getDataGrid(val?) {
    let body = {
      "searchFields": [
        {
          "fieldName": "shipId",
          "fieldVal": val ? val : 'null'
        }
      ]
    }
    if (!val) {
      body.searchFields = []
    }
    this.exportBody = body;
    this.dataSource = [];
    // this.itemServices.getDataShipGrid(body).subscribe((res: any) => {
    //   this.dataSource = res.data;
    // })
  }
  changeDd() {
    this.shipId = '';
    if (!this.dataSource.length) {
      this.shipId = this.selectLoc + 4000
    }
    else {

      let lastShipId = parseInt(this.dataSource[this.dataSource.length - 1].shipId.match(/\d+/g)[0])
      lastShipId++
      this.shipId = this.selectLoc + lastShipId
    }

  }

  statusdpw() {
    // this.itemServices.getBookingStatus().subscribe((res: any) => {
    //   this.status = res.data
    // })
  }

  ftyitem() {
    this.itemServices.getAllPlainFty().subscribe((res: any) => {
      this.ftydpw = res.data;
    })
  }


  resetPosition() { }

  updateActionButtons() {
  }

  showMaximizableDialog1(data) { }


  getExcelPop2(type) { }


  search() {
    if (!this.seachStr) {
      setTimeout(() => {
        this.getDataGrid()
      }, 500)
    }
    else {
      this.keyUpFxn.next(this.seachStr);

    }
  }

  deleteShipBtn = this.deleteShipId.bind(this)

  deleteShipId(e: any) {
    this.popu_Id = e.row.key;
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
        this.itemServices.deleteShipId(this.popu_Id).subscribe((res: any) => {
          this.getDataGrid();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        })
        this.itemLoading = false;
        this.deleteDialogue = false;
        this.popu_Id = '';
        this.deleteText = '';
      }
     else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please enter YES ', life: 3000 });
    }
  }

  openNew() {
    this.displayMaximizable = true;
    this.selectLoc = ''
    this.shipId = ''
  }
  generateShipid() {
    let data = {
      shipId: this.shipId,
      loc: this.selectLoc,
    }
    this.itemServices.createShipId(data).subscribe((res: any) => {
      if (!res.error) {
        this.displayMaximizable = false
        this.getDataGrid()
      } else {
        return;
      }
    })
  }

  hideDeleteDialog() {
    this.deleteDialogue = false;
    // this.submitted = false;
    this.itemLoading = false;
    this.deleteText = '';
  }

  onSaving(e: any) {
    if (e.changes.length) {
      e.promise = this.updateGriddata(`${environment.url}ShipIdTracker/SaveShipIdTracker`, e.changes, e.component);
    }
  }

  async updateGriddata(url: string, changes: Array<{}>, component: DxDataGrid): Promise<any> {
    await this.http.post(url, JSON.stringify(changes), {
      withCredentials: true,
    }).toPromise();
    await component.refresh(true);
    this.getDataGrid();
    component.cancelEditData();
  }


  getExceltab1(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    }
    else {
      this.loadCsvFile = true;
    }

    this.itemServices.downloadExcelForShipTab1(type,this.exportBody).subscribe((res) => {
      this.loadExlFile = false;
      this.loadPdfFile = false;
      this.loadCsvFile = false;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      let a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      if (type == 'xlsx') {
        a.download = `_report-${this.currentDate}.xlsx`;
      }
      else {
        a.download = `_report-${this.currentDate}.csv`;
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
  getExceltab2(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    }
    else {
      this.loadCsvFile = true;
    }

    this.itemServices.downloadExcelForShipTab2(type,this.exportBody).subscribe((res) => {
      this.loadExlFile = false;
      this.loadPdfFile = false;
      this.loadCsvFile = false;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      let a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      if (type == 'xlsx') {
        a.download = `_report-${this.currentDate}.xlsx`;
      }
      else {
        a.download = `_report-${this.currentDate}.csv`;
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
  getExceltab4(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    }
    else {
      this.loadCsvFile = true;
    }

    // this.itemServices.downloadExcelForShipTab6(type,this.exportBody).subscribe((res) => {
    //   this.loadExlFile = false;
    //   this.loadPdfFile = false;
    //   this.loadCsvFile = false;
    //   const blob = new Blob([res], { type: 'application/octet-stream' });
    //   let a = window.document.createElement('a');
    //   a.href = window.URL.createObjectURL(blob);
    //   if (type == 'xlsx') {
    //     a.download = `_report-${this.currentDate}.xlsx`;
    //   }
    //   else {
    //     a.download = `_report-${this.currentDate}.csv`;
    //   }
    //   document.body.appendChild(a);
    //   a.click();
    //   setTimeout(() => {
    //     document.body.removeChild(a)
    //   }, 100)
    // }, err => {
    //   this.loadExlFile = false;
    //   this.loadPdfFile = false;
    //   this.loadCsvFile = false;
    //   this.toastr.errorToastr('Oops something went wrong')
    // })
   }
  getExceltab6(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    }
    else {
      this.loadCsvFile = true;
    }

    this.itemServices.downloadExcelForShipTab4(type,this.exportBody).subscribe((res) => {
      this.loadExlFile = false;
      this.loadPdfFile = false;
      this.loadCsvFile = false;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      let a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      if (type == 'xlsx') {
        a.download = `_report-${this.currentDate}.xlsx`;
      }
      else {
        a.download = `_report-${this.currentDate}.csv`;
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

getColumnDef(tab) {
    let allCol: ColDef[] = [
      /*0*/{field: 'shipId', headerName:'SHIPID', editable:true, sortable:true, resizable:true},
      /*1*/{field: 'rcp', headerName:'RCP#', editable:true, sortable:true, resizable:true},
      /*2*/{field: 'loc', headerName:'LOC', editable:true, sortable:true, resizable:true},
      /*3*/{field: 'fty', headerName:'FTY', editable:true, sortable:true, resizable:true},
      /*4*/{field: 'rrd', headerName:'RRD', editable:true, sortable:true, resizable:true, filter: 'agDateColumnFilter', cellEditor:AgDatePicker},
      /*5*/{field: 'erd', headerName:'ERD', editable:true, sortable:true, resizable:true},
      /*6*/{field: 'etd', headerName:'ETD', editable:true, sortable:true, resizable:true},
      /*7*/{field: 'eta', headerName:'ETA', editable:true, sortable:true, resizable:true},
      /*8*/{field: 'contDlvd', headerName:'CONT DLVD', editable:true, sortable:true, resizable:true},
      /*9*/{field: 'contEmpty', headerName:'CONT EMPTY', editable:true, sortable:true, resizable:true},
      /*10*/{field: 'contReturn', headerName:'CONT RETURN', editable:true, sortable:true, resizable:true},
      /*11*/{field: 'bk', headerName:'BK#', editable:true, sortable:true, resizable:true},
      /*12*/{field: 'shipVia', headerName:'SHIP VIA', editable:true, sortable:true, resizable:true},
      /*13*/{field: 'qty', headerName:'QTY', editable:true, sortable:true, resizable:true},
      /*14*/{field: 'extCube', headerName:'EXT CUBE', editable:true, sortable:true, resizable:true},
      /*15*/{field: 'arrivalNotice', headerName:'ARRIVAL NOTICE', editable:true, sortable:true, resizable:true},
      /*16*/{field: 'do', headerName:'D/O', editable:true, sortable:true, resizable:true},
      /*17*/{field: 'cCost', headerName:'CCOST', editable:true, sortable:true, resizable:true},
      /*18*/{field: 'teminal', headerName:'TERMINAL', editable:true, sortable:true, resizable:true},
      /*19*/{field: 'notes', headerName:'NOTES', editable:true, sortable:true, resizable:true},
      /*20*/{field: 'bookingNo', headerName:'BOOKING NO', editable:true, sortable:true, resizable:true},
      /*21*/{field: 'containerNo', headerName:'CONTAINER NO', editable:true, sortable:true, resizable:true},
      /*22*/{field: 'uscDate', headerName:'USC DATE', editable:true, sortable:true, resizable:true},
      /*23*/{field: 'ftyPayment', headerName:'FTY PAYMENT', editable:true, sortable:true, resizable:true},
      /*24*/{field: 'dueDate', headerName:'DUE DATE', editable:true, sortable:true, resizable:true},
      /*25*/{field: 'totalEstCost', headerName:'TOTAL EST COST', editable:true, sortable:true, resizable:true},
      /*26*/{field: 'generatedBy', headerName:'GENERATED BY', editable:true, sortable:true, resizable:true},
      /*27*/{field: 'generatedOn', headerName:'GENERATED ON', editable:true, sortable:true, resizable:true},
      /*28*/{field: 'lastUpdatedBy', headerName:'LAST UPDATED BY', editable:true, sortable:true, resizable:true},
      /*29*/{field: 'lastUpdatedOn', headerName:'LAST UPDATED ON', editable:true, sortable:true, resizable:true},
      /*30*/{field: 'bookingStatus', headerName:'STATUS', editable:true, sortable:true, resizable:true},
      /*31*/{field: 'arrivalNotice', headerName:'ARRIVAL NOTICE', editable:true, sortable:true, resizable:true},

    ]
    let allowedCols = {
      tab1: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,26,28,29],
      tab2: [0,2,3,4,5,26,27,28,29],
      tab3: [0,2,3,30,4,5,6,7,11,12,13,14,17,19,28,29],
      tab4: [0,2,3,6,7,11,13,14,16,17,18,19,23,24,25,31,28,29],
    };
    let cols:ColDef[] =[];
    allowedCols[`tab${tab}`].forEach(indx => {
      cols.push(allCol[indx])
    })
    return cols;
   }

   checkStatus(e) {
   }

}
