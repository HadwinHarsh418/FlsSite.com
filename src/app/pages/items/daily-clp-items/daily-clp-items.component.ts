import { Component, Input, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';
import { CLPS } from 'src/app/models/clps';
import { Directory } from 'src/app/models/folders';
import { Page } from 'src/app/models/page';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { ClpsService } from 'src/app/services/clps.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-daily-clp-items',
  templateUrl: './daily-clp-items.component.html',
  styleUrls: ['./daily-clp-items.component.css']
})
export class DailyClpItemsComponent implements OnInit {


  user: Users;
  cpls: CLPS[];
  loading: boolean = true;
  editableObject: CLPS;
  clpsDialogue: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  date3: Date;

  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false
  }
  btnText: string = 'Save';
  totalRecords: number = 0;
  page: Page = new Page();
  MAX_SIZE: number = 20;
  btnDisabled: boolean = false;
  searchItemNo: string = '';
  searchPo: string = '';
  searchShpTid: string = '';
  cols: any[] = [];
  dailyClp: CLPS[];
  totalAmount: any = 0;
  totalCbm: number = 0;
  loadExlFile: boolean;
  _selectedColumns: any[] = [];
  hide: boolean = false;
  selectedItems: CLPS[];
  folderName: Directory[];

  selectedFolder: string;
  operations: { op?: string }[] = [
    { op: 'Approved' },
    { op: 'Rejected' },
  ]
  selectedOp: { op?: string };
  duplicateRcd: CLPS[];
  duplicatePopUo: boolean;
  extraCols: any = [];
  openExtraCol: boolean;

  loadingShortCut: boolean;
  stCode: number = 0;
  // startDate: Date;
  private keyUpFxn = new Subject<any>();
  value: boolean;
  private _startDate: Date;
  private _endDate: Date;
  viewOperationedClps: boolean = false;
  colLength: number = 0;
  duplicateRcdNo: number = 0;
  loadCsvFile: boolean;

  totalNumber :any;
  Limit =20;
  paging: any;
  startFrom: number;

  set startDate(date: Date) {
    this._startDate = date;
    // if (!this._startDate)
    this.endDate = new Date();
    this.getAllDailyItems();

  }

  get startDate(): Date {
    return this._startDate;
  }

  set endDate(date: Date) {
    this._endDate = date;
    if (!this._endDate)
      this.getAllDailyItems();

  }

  get endDate(): Date {
    return this._endDate;
  }



  constructor(
    private toastr: ToastrManager,
    private userService:UserService,
    private messageService: MessageService,
    private clpsService: ClpsService,
    private dtMmgmtService: DataManagementService
  ) {
    this.user=this.userService.tokenKey.user;
    this.selectedItems = [];
    this.getShortCutStatus();
    this.setPage();

  }

  ngOnInit(): void {
    this.keyUpFxn.pipe(
      debounceTime(500)
    ).subscribe(searchTextValue => {
      if (searchTextValue && searchTextValue.val.trim())
        this.getAllDailyItems(null, searchTextValue);
    });

  }


  search(type) {
    let stringVal = ''
    if (type == 'itemNo') {
      stringVal = this.searchItemNo;
      this.searchPo = '';
      this.searchShpTid = '';
    }
    else if (type == 'po') {
      stringVal = this.searchPo;
      this.searchItemNo = '';
      this.searchShpTid = ''
    }
    else {
      stringVal = this.searchShpTid;
      this.searchPo = '';
      this.searchItemNo;
    }
    let obj = { val: stringVal, type: type };
    if (!this.searchItemNo && !this.searchPo && !this.searchShpTid) {
      this.getAllDailyItems(null, null)
    }
    else {
      this.keyUpFxn.next(obj);
    }
  }
  // not in use now
  // getAllFoldersName() {
  //   this.loading = true;
  //   this.clpsService.getAllClpItemFolders().subscribe((res: Response) => {
  //     if (res.statusCode == 200) {
  //       this.folderName = res.data;
  //       if (this.folderName.length) {
  //         this.selectedFolder = this.folderName[0].name
  //       }
  //     }
  //     else {
  //       this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
  //     }
  //   })
  // }
  getAllDailyItemsOld(folder?) {
    this.loading = true;
    this.clpsService.getDailyClps({ name: folder }).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.cols = this.columnsHeader();
        this.dailyClp = res.data['clpData'];
        this.duplicateRcd = res.data['duplicateRecs'];
        this.duplicateRcdNo = res['duplicateRecsNo'];

        this.extraCols = res.data['extraCols']
        if (this.extraCols.length)
          this.openExtraCol = true;
        if (this.dailyClp.length) {
          if (!this.selectedFolder) {
            this.selectedFolder = this.dailyClp[0].dirName;
          }
        }
        this.dailyClp.map(dc => {
          dc.uniKey = dc.po + dc.poLine
          if (!dc.isVisible)
            dc.isVisible = false
        })
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }


  getAllDailyItems(event?: LazyLoadEvent, val?) {
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
    let searchColumn = '';
    let searchVal = '';
    let startDate = this._startDate ? `${this._startDate.getFullYear()}-${this.getMonth(this._startDate.getMonth() + 1)}-${this._startDate.getDate()}` : null;
    let endDate = this._endDate ? `${this._endDate.getFullYear()}-${this.getMonth(this._endDate.getMonth() + 1)}-${this._endDate.getDate()}` : null;
    if (val && val.val) {
      searchVal = val.val;
      searchColumn = val.type;
    }
    if (event && event.globalFilter) params += '&filter=' + event.globalFilter;
    // if (event && event.sortField) params += '&sortDir=' + ((event.sortOrder == 1) ? 'asc' : 'desc') + '&sortCol=' + event.sortField;
    if (event && event.sortField) {
      srD = (event.sortOrder == 1) ? 'asc' : 'desc';
      srC = event.sortField;
    }
    // if (Object.keys(event.filters).length != 0 && event.filters.constructor === Object) params += '&filter=' + JSON.stringify(event.filters);
    if (event) {
      if (Object.keys(event.filters).length != 0 && event.filters.constructor === Object) {
        ft = event.filters;
        this.searchItemNo = '';
        this.searchShpTid = '';
        this.searchPo = ''

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
    if (startDate && endDate) {
      let dtBig = this.endAfterStart(startDate, endDate)
      if (!dtBig) {
        this.toastr.errorToastr('End date can not be greater than start data')
        return
      }
    }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: (event && event.globalFilter) ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      searchCol: searchColumn,
      searchVal: searchVal,
      startDate: startDate,
      endDate: endDate,
      viewOperationedClps: this.viewOperationedClps
      // userId: null

    }
    this.totalAmount = 0;
    this.totalCbm = 0;
    this.loading = true;
    this.clpsService.getDailyClps(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.pageNumber = res.pageNumber;
            this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        if (!this.cols.length) {
          this.cols = this.columnsHeader();
          this.colLength = this.cols.length;
        }
        this.dailyClp = res.data;
        this.duplicateRcd = res['duplicateRecs'];
        this.duplicateRcdNo = res['duplicateRecsNo'];
        this.extraCols = res['extraCols']
        if (this.extraCols.length)
          this.openExtraCol = true;
        if (this.dailyClp.length) {
          if (!this.selectedFolder) {
            this.selectedFolder = this.dailyClp[0].dirName;
          }
        }
        this.dailyClp.map(dc => {
          dc.uniKey = dc.po + dc.poLine + dc.itemNo
          if (!dc.isVisible)
            dc.isVisible = false
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

  getMonth(mth) {
    if (mth < 10) {
      mth = '0' + mth;
    }
    return mth;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  columnsHeader() {
    this.cols = [];
    let columns = [

      { hidden: false, field: 'poDate', header: 'PO DATE', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { hidden: false, field: 'loc', header: 'LOC', type: 'text' },
      { hidden: false, field: 'po', header: 'PO', type: 'text' },
      { hidden: false, field: 'poLine', header: 'PO LINE', type: 'input' },
      { hidden: false, field: 'fty', header: 'FTY', type: 'text' },
      { hidden: false, field: 'vdCode', header: 'VDCODE', type: 'text' },

      { hidden: false, field: 'itemNo', header: 'ITEM NO', type: 'text' },
      { hidden: false, field: 'um', header: 'UM', type: 'text' },
      { hidden: false, field: 'itemDesc', header: 'ITEM DESC', type: 'text' },
      { hidden: false, field: 'logo', header: 'LOGO', type: 'text' },

      { hidden: false, field: 'qty', header: 'QTY', type: 'text' },
      { hidden: false, field: 'cost', header: 'COST', type: 'text', currency: true },

      { hidden: false, field: 'rrd', header: 'RRD', type: 'date', format: `MM/dd/yyyy`, data: true, },

      // { hidden: false, field: 'webId', header: 'WEB ID', type: 'text' },
      // { hidden: false, field: 'shipId', header: 'SHIP ID', type: 'text' },
      // { hidden: false, field: 'extCost', header: 'EXT COST', type: 'text' },
      // { hidden: false, field: 'cbm', header: 'CBM', type: 'text' },

      // { hidden: false, field: 'erd', header: 'ERD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      // { hidden: false, field: 'etd', header: 'ETD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      // { hidden: false, field: 'eta', header: 'ETA', type: 'date', format: `MM/dd/yyyy`, data: true, },

      // { hidden: false, field: 'bk', header: 'BK', type: 'input' },
      // { hidden: false, field: 'cCost', header: 'C COST', type: 'input' },
      // { hidden: false, field: 'cont', header: 'CONT', type: 'input' },
      // { hidden: false, field: 'shipVia', header: 'SHIP VIA', type: 'input' },
      // { hidden: false, field: 'usc', header: 'USC', type: 'input' },

      // { hidden: false, field: 'l', header: 'L', type: 'text' },
      // { hidden: false, field: 'w', header: 'W', type: 'text' },
      // { hidden: false, field: 'h', header: 'H', type: 'text' },
      // { hidden: false, field: 'cube', header: 'CUBE', type: 'text' },
      // { hidden: false, field: 'extCube', header: 'EXT CUBE', type: 'text' },

      // { hidden: false, field: 'lb', header: 'LB', type: 'text' },
      // { hidden: false, field: 'chgbk', header: 'CHGBK', type: 'text' },
      // { hidden: false, field: 'pcscs', header: 'PCSCS', type: 'text' },
      // { hidden: false, field: 'notes', header: 'NOTES', type: 'text' },

      // { hidden: false, field: 'htsValue', header: 'HTS VALUE', type: 'text' },
      // { hidden: false, field: 'htsCode', header: 'HTS CODE', type: 'text' },
      // { hidden: false, field: 'fdaDesc', header: 'FDA DESC', type: 'text' },
      // { hidden: false, field: 'do', header: 'DO', type: 'text' },
      // { hidden: false, field: 'terminal', header: 'TERMINAL', type: 'text' },

      // { hidden: false, field: 'consignee', header: 'CONSIGNEE', type: 'text' },
      // { hidden: false, field: 'tariffCode', header: 'TAREFF CODE', type: 'text' },
      // { hidden: false, field: 'tariffValue', header: 'TARIFF VALUE', type: 'text' },
      // { hidden: false, field: 'gri', header: 'GRI', type: 'text' },
      // { hidden: false, field: 'gwCtn', header: 'GWCTN', type: 'text' },

      // { hidden: false, field: 'gw', header: 'GW', type: 'text' },
      // { hidden: false, field: 'cntrNo', header: 'CNTR NO.', type: 'text' },
      // { hidden: false, field: 'cbmCtn', header: 'CBMCTN', type: 'text' },
      // { hidden: false, field: 'clp', header: 'CLP', type: 'text' },

      { hidden: true, field: 'uniKey', header: 'UNIKEY', type: 'text' },
      { hidden: true, field: 'isVisible', header: 'isVisiblle', type: 'text' },
    ]
    return columns;

  }


  endAfterStart(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    return endDate.getTime() >= startDate.getTime();
  }

  check() {
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
        this.editableObject.rrd = this.editableObject.rrd ? new Date(this.editableObject.rrd) : null;
        this.editableObject.erd = this.editableObject.erd ? new Date(this.editableObject.erd) : null;
        this.editableObject.poDate = this.editableObject.poDate ? new Date(this.editableObject.poDate) : null;
        this.clpsDialogue = true;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })
  }
  hideDialog() {
    this.clpsDialogue = false;
    this.submitted = false;
    this.itemLoading = false;
    this.selectedItems = [];
    this.selectedOp = null
    this.btnText = 'Save'
  }




  saveAllClp() {
    let allParents = this.cpls.filter(c => c.isParent == true);
    let imfalse = false;
    allParents.forEach(ap => {
      let allQty = this.cpls.filter(fl => fl.list_id == ap.list_id);
      let totalQty = allQty.reduce((a, b) => a += b.splitQty, 0);
      if (totalQty > ap.qty) {
        imfalse = true;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Split qty can not be greater than & equal its actual value', life: 3000 });
        return;
      }
    })
    if (imfalse) return;
    this.loading = true;
    let newClps = JSON.parse(JSON.stringify(this.cpls));
    newClps.map(cl => {
      cl.poDate = this.convertToDate(cl.poDate);
      cl.dateCreated = this.convertToDate(cl.dateCreated);
      cl.rrd = this.convertToDate(cl.rrd);
      cl.erd = this.convertToDate(cl.erd);
      cl.etd = this.convertToDate(cl.etd);
      cl.eta = this.convertToDate(cl.eta);

    })
    this.btnDisabled = true
    this.clpsService.addAllClp(newClps).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this.btnDisabled = false;
        this.getAllDailyItems();
      }
    })
  }
  convertToDate(dt, printDate = false) {
    let date = new Date(dt);
    let d;
    let month;
    let day;
    if (dt) {
      month = '' + (date.getMonth() + 1);
      day = '' + date.getDate();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      if (printDate)
        d = `${month}/${day}/${date.getFullYear()}`;
      else
        d = `${date.getFullYear()}/${month}/${day}`;
    }
    else {
      d = null
    }
    return d
  }


  onChange(event) {
    this.selectedItems = [];
    this.getAllDailyItems(event.value)
  }

  saveProduct() {
    if (this.selectedItems.length) {
      if (!this.selectedOp) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select operation', life: 3000 });
        return

      }
      this.itemLoading = true;
      // let newArr = [...this.dailyClp.filter(x => !x.isVisible)]
      let newArr: CLPS[] = JSON.parse(JSON.stringify(this.dailyClp.filter(x => !x.isVisible)));

      this.selectedItems.forEach(aclp => {
        newArr.forEach(selected => {
          if (!selected.isVisible) {
            if (aclp.uniKey === selected.uniKey) {
              selected.userOperation = this.selectedOp.op;
              selected.isVisible = true;
              selected.isParent = true
            }
          }
          // selected.id = '';
        })
      })
      // deep cloning here
      newArr = newArr.filter(arr => arr.userOperation != '');
      // nya= ar.map(e=>({...e}))
      this.clpsService.addAllClp(newArr).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.submitted = false;
          this.clpsDialogue = false;
          this.itemLoading = false;
          this.selectedItems = [];
          this.getAllDailyItems();
          this.btnText = 'Save'
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
        }
      }, error => {
      });

    }
  }
  openDuplicaterc() {
    this.duplicatePopUo = true;
  }
  hideDefaultDialog() {
    this.duplicatePopUo = false;
  }

  hidewarningDialog() {
    this.openExtraCol = false
  }
  cancel() {
    // alert('closed')
  }

  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-wallet',
      url: "/items-list/daily-clp-items",
      shortcutName: "Daily CLP items",
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
    this.dtMmgmtService.getSortcutName('Daily CLP items').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }
  handleData(event) {
    this.viewOperationedClps = event.checked
    this.getAllDailyItems();
  }

  vanishFilter() {
    this.startDate = null;
    this.endDate = null;
    this.searchItemNo = '';
    this.searchPo = '';
    this.viewOperationedClps = false
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
    this.getAllDailyItems();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.getAllDailyItems(null);
}


}
