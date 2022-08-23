import { Component, Input, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
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
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-info-clps',
  templateUrl: './info-clps.component.html',
  styleUrls: ['./info-clps.component.css']
})
export class InfoClpsComponent implements OnInit {
  user: Users;
  cpls: CLPS[];
  loading: boolean = true;
  editableObject: CLPS;
  clpsDialogue: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  date3: Date;

  totalNumber :any;
  Limit =20;
  paging: any;
  actions = {
    canAdd: false,
    canEdit: false,
    canImportCsv: false,
    canImportExl: false
  }
  btnText: string = 'Save';
  totalRecords: number = 0;
  page: Page = new Page();
  MAX_SIZE: number = 20;
  btnDisabled: boolean = false;
  private keyUpFxn = new Subject<any>();
  searchItemNo: string = '';
  searchPo: string = '';
  searchShpTid: string = '';
  searchFty: string = '';
  searchLoc: string = '';
  searchETA: Date;
  searchDateType:string = '';

  cols: any[] = [];
  totalAmount: any = 0;
  totalCbm: number = 0;
  loadExlFile: boolean;
  _selectedColumns: any[] = [];
  hide: boolean = false;
  selectedCols: any = [];
  colLength: number = 0;
  debounceApi = new Subject<any>();
  defaultColumnsPop: boolean;
  columnArr: any = [];
  loadingDefaultCol: boolean;

  loadingShortCut: boolean;
  stCode: number = 0;
  uploadStatus: {
    totalRows: 0,
    rowsInserted: 0,
    rowsNotInserted: 0
  }
  openExtraCol: boolean;
  hideUploadSec: boolean

  actionBtn: boolean;
  loadCsvFile: boolean;
  totalExtCube: number = 0;
  totalQty: number = 0;
  loadData: boolean;

  startDate: Date
  endDate: Date
  searchObj: { val: string; type: any; };
  startFrom: number;
  datefieldArr: any[];
  exportbody: { size: any; page: any; filter: any; sortDir: string; sortCol: string; gridFilters: {}; dateFields: any[]; searchFields: any[]; };

  constructor(
    private toastr: ToastrManager,
    private userService:UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clpsService: ClpsService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService,

  ) {
    this.user=this.userService.tokenKey.user;
    this.getShortCutStatus();
  }

  ngOnInit(): void {
    // this.getAllClps();
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(31),
      canEdit: this.permissionService.getPermissionStatus(33),
      canImportExl: this.permissionService.getPermissionStatus(49),
      canImportCsv: this.permissionService.getPermissionStatus(50),


    }
    this.setPage();


    this.keyUpFxn.pipe(
      debounceTime(1000)
    ).subscribe(searchTextValue => {
      if (searchTextValue && searchTextValue.val.trim())
        this.loadCustomers(null);
    });

    this.debounceApi.pipe(
      debounceTime(500)
    ).subscribe(data => {
      this.saveColumns(data);
    });

  }
  getDate(dt: Date) {
    return `${dt.getFullYear()}-${this.get2digitNum(dt.getMonth() + 1)}-${this.get2digitNum(dt.getDate())}`;
  }

  get2digitNum(num) {
    let nums = parseInt(num);
    return nums >= 10 ? num : `0${num}` 
  }

  search(type) {
    let stringVal = '';
    if(!this.searchDateType){
      this.datefieldArr = []
    }
    if (this.searchDateType) {
      if(!this.startDate || !this.endDate){
        this.toastr.errorToastr('Start Date & End Date Must be Selected')
        return;
      }
      if (this.startDate || this.endDate) {
        let dateFields:any[] = []
        dateFields.push({
          fieldName: this.searchDateType,
          startDate: this.startDate ? this.getDate(this.startDate) : '',
          endDate: this.endDate ? this.getDate(this.endDate) : '',
        });
        this.datefieldArr = dateFields;
        this.loadCustomers()
      }
    }
    if ((type == 'itemNo' && this.searchItemNo) || this.searchItemNo) {
      stringVal = this.searchItemNo;
      // this.searchPo = '';
      // this.searchShpTid = '';
      // this.searchLoc = '';
      // this.searchFty = '';
      // this.searchETA = null;

    }
    else if ((type == 'poNo' && this.searchPo) || this.searchPo) {
      stringVal = this.searchPo;
      // this.searchItemNo = '';
      // this.searchShpTid = ''
      // this.searchLoc = '';
      // this.searchFty = '';
      // this.searchETA = null;
    }
    else if ((type == 'loc' && this.searchLoc) || this.searchLoc) {
      stringVal = this.searchLoc;
      // this.searchItemNo = '';
      // this.searchShpTid = ''
      // this.searchPo = '';
      // this.searchFty = '';
      // this.searchETA = null;

    }
    else if ((type == 'fty' && this.searchFty) || this.searchFty) {
      stringVal = this.searchFty;
      // this.searchItemNo = '';
      // this.searchShpTid = '';
      // this.searchLoc = '';
      // this.searchPo = '';
      // this.searchETA = null;

    }
    // else if (type == 'eta') {
    //   let etaDate = this.searchETA ? `${this.searchETA.getFullYear()}-${this.getMonth(this.searchETA.getMonth() + 1)}-${this.getMonth(this.searchETA.getDate())}` : null;
    //   stringVal = etaDate;
    //   this.searchItemNo = '';
    //   this.searchShpTid = '';
    //   this.searchLoc = '';
    //   this.searchPo = '';

    // }
    else if ((type == 'shipId' && this.searchShpTid) || this.searchShpTid) {
      stringVal = this.searchShpTid;
      // this.searchItemNo = '';
      // this.searchLoc = '';
      // this.searchPo = '';
      // this.searchFty;
      // this.searchETA = null;

    }else{
      this.loadCustomers(null)
    }
    this.searchObj = { val: stringVal, type: type };
    if (!this.searchItemNo && !this.searchPo && !this.searchShpTid && !this.searchFty && !this.searchFty && !this.searchETA) {
      this.loadCustomers(null)
    }
    else {
      this.keyUpFxn.next(this.searchObj);
    }
  }

  loadCustomers(event?: LazyLoadEvent) {
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
    let searchColumn = '';
    let searchVal = '';
    if (event && event.globalFilter) params += '&filter=' + event.globalFilter;
    if (event && event.sortField) {
      srD = event.sortOrder == 1 ? 'asc' : 'desc';
      srC = event.sortField;
    }
    if (event) {
      if (
        Object.keys(event.filters).length != 0 &&
        event.filters.constructor === Object
      ) {
        ft = event.filters;
      }
    }
    let searchFields: any[] = [];

    if (this.searchItemNo?.trim()) {
      searchFields.push({ fieldName: 'itemNo', fieldVal: this.searchItemNo });
    }
    if (this.searchPo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPo });
    }
    if (this.searchShpTid?.trim()) {
      searchFields.push({ fieldName: 'shipId', fieldVal: this.searchShpTid });
    }
    if (this.searchFty?.trim()) {
      searchFields.push({ fieldName: 'fty', fieldVal: this.searchFty });
    }
    if (this.searchLoc?.trim()) {
      searchFields.push({ fieldName: 'loc', fieldVal: this.searchLoc });
    }
    
    this.exportbody = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      dateFields:this.datefieldArr,
      searchFields: searchFields,
    };

    // const body = {
    //   size: this.paging.pageSize,
    //   page: this.paging.pageNumber,
    //   filter: (event && event.globalFilter) ? event.globalFilter : '',
    //   sortDir: srD,
    //   sortCol: srC,
    //   gridFilters: ft,
    //   searchCol: searchColumn,
    //   searchVal: searchVal,
    //   dateFields: this.datefieldArr
    //   // userId: null

    // }
    this.totalAmount = 0;
    this.totalCbm = 0;
    this.totalExtCube = 0;
    this.totalQty = 0;
    this.clpsService.getAllInfoClps(this.exportbody).subscribe((res) => {
      if (res.statusCode == 200) {
        this.cpls = res.data;
        this.paging.pageNumber = res.pageNumber;
            this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        if (!this.cols.length) {
          let columnsArray = this.columnsHeader();
          this.cols = [];
          this._selectedColumns = (this._selectedColumns.length > 0) ? this._selectedColumns : this.cols;
          if (res.selectedCols.length) {
            this.selectedCols = res.selectedCols
            res.selectedCols.forEach(element => {
              columnsArray.forEach(cl => {
                cl.isDisplay = (res.selectedCols.findIndex(cp => cp == cl.field) > -1)
                if (cl.field === element) {
                  this.cols.push(cl)
                }
              });
            });
            columnsArray.forEach(el => {
              if (!el.isDisplay) {
                this.cols.push(el)
              }

            });
            this.selectedColumns = this.cols.filter(items => this.selectedCols.includes(items.field))
            this.colLength = this.cols.length;
          }
        }
        this.cpls.forEach(clps => {
          clps.newSplitVal = clps.splitQty;
          if (clps.erd) {
            clps.erd = new Date(clps.erd);
            clps.erdDt = this.convertToDate(clps.erd, true);
          }
          if (clps.rrd) {
            clps.rrd = new Date(clps.rrd);
            clps.rrdDt = this.convertToDate(clps.rrd, true);

          }
          if (clps.poDate) {
            clps.poDate = new Date(clps.poDate);
            clps.poDt = this.convertToDate(clps.etd, true);

          }
          if (clps.etd) {
            clps.etd = new Date(clps.etd);
            clps.newEtd = this.convertToDate(clps.etd, true)
          }

          if (clps.eta) {
            clps.eta = this.convertToDate(clps.eta, true)
            clps.newEta = this.convertToDate(clps.eta, true)

          }

          clps.list_id = clps.po + clps.itemNo + clps.poLine;
          this.totalAmount += clps.extCost;
          this.totalCbm += clps.cbm
          this.totalExtCube += clps.extCube
          this.totalQty += clps.qty

          // clps.amount = clps.splitQty * clps.price;
          // clps.isParent  = true;
        });
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
  endAfterStart(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    return endDate.getTime() >= startDate.getTime();
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  columnsHeader() {
    let columns = [

      { isDisplay: false, field: 'poDate', header: 'PO DATE', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'fty', header: 'FTY', type: 'text' },
      { isDisplay: false, field: 'rcp', header: 'RCP#' },
      { isDisplay: false, field: 'loc', header: 'LOC', type: 'text' },
      { isDisplay: false, field: 'poNo', header: 'PO NO.', type: 'text' },
      { isDisplay: false, field: 'poLine', header: 'PO LINE', type: 'text' },
      { isDisplay: false, field: 'shipId', header: 'SHIP ID', type: 'text' },
      { isDisplay: false, field: 'itemNo', header: 'ITEM NO.', type: 'text' },
      { isDisplay: false, field: 'qty', header: 'QTY', type: 'text' },
      { isDisplay: false, field: 'cube', header: 'CUBE', type: 'text' },
      { isDisplay: false, field: 'extCube', header: 'EXT CUBE', type: 'text' },
      { isDisplay: false, field: 'cost', header: 'COST', type: 'text', currency: true },
      { isDisplay: false, field: 'extCost', header: 'EXT COST', type: 'text', currency: true },
      { isDisplay: false, field: 'erd', header: 'ERD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'rrd', header: 'RRD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'etd', header: 'ETD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'eta', header: 'ETA', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'bkNo', header: 'BK NO.', type: 'text' },
      { isDisplay: false, field: 'contNo', header: 'CONT NO.', type: 'text' },
      { isDisplay: false, field: 'shipVia', header: 'SHIP VIA', type: 'input' },
      { isDisplay: false, field: 'usc', header: 'USC', type: 'input' },
      { isDisplay: false, field: 'notes', header: 'NOTES', type: 'text' },
      { isDisplay: false, field: 'logo', header: 'LOGO', type: 'text' },
      { isDisplay: false, field: 'freightCost', header: 'FREIGHT COST', type: 'text' },
      { isDisplay: false, field: 'terminal', header: 'TERMINAL', type: 'text' },
      { isDisplay: false, field: 'pol', header: 'POL', type: 'text' },

    ]
    return columns;

  }


  deleteProduct(clps: CLPS) {
    const nameCapitalized = clps.itemNo.charAt(0).toUpperCase() + clps.itemNo.slice(1);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.clpsService.deleteClps(clps.id).subscribe((res) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.loadCustomers();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
          }
          else if (res.statusCode == 200 && res.data == 2) {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
          }
          else {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
          }
        })

      }
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
    this.btnText = 'Save'
  }

  saveProduct() {
    this.submitted = true;
    if (this.editableObject.itemNo.trim() && this.editableObject.fty.trim() && this.editableObject.po.trim() && this.editableObject.qty) {
      this.itemLoading = true;
      let rrd;
      let erd;
      let poDate;
      let eta
      let etd
      if (this.editableObject.rrd) {
        rrd = `${this.editableObject.rrd.getFullYear()}-${this.editableObject.rrd.getMonth() + 1}-${this.editableObject.rrd.getDate()}`;
      }
      if (this.editableObject.erd) {
        erd = `${this.editableObject.erd.getFullYear()}-${this.editableObject.erd.getMonth() + 1}-${this.editableObject.erd.getDate()}`;
      }
      if (this.editableObject.poDate) {
        poDate = `${this.editableObject.poDate.getFullYear()}-${this.editableObject.poDate.getMonth() + 1}-${this.editableObject.poDate.getDate()}`;
      }
      if (this.editableObject.eta) {
        eta = `${this.editableObject.eta.getFullYear()}-${this.editableObject.eta.getMonth() + 1}-${this.editableObject.eta.getDate()}`;
      }
      if (this.editableObject.etd) {
        etd = `${this.editableObject.etd.getFullYear()}-${this.editableObject.etd.getMonth() + 1}-${this.editableObject.etd.getDate()}`;
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
        userOperation: null

      }
      if (this.editableObject.id) {
        this.clpsService.updateClps(data).subscribe((response: Response) => {
          if (response.statusCode == 200 && response.data == 1) {
            this.submitted = false;
            this.clpsDialogue = false;
            this.itemLoading = false;
            this.editableObject = new CLPS();
            this.btnText = 'Save'
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.loadCustomers();
          }
          else if (response.statusCode == 200 && response.data == -1) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
          else if (response.statusCode == 400) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
          }
        }, error => {
        });
      }
      else {
        this.clpsService.addClps(data).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            this.submitted = false;
            this.clpsDialogue = false;
            this.itemLoading = false;
            this.editableObject = new CLPS();
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
    }
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

  splitQty(clp: CLPS, columnName) {
    if (columnName === 'splitQty') {
      clp.splitQty = clp.splitQty ? parseInt(clp.splitQty.toString()) : clp.splitQty;
      let allQty = this.cpls.filter(fl => fl.list_id == clp.list_id);
      let mainQty = allQty.filter(fl => fl.isParent)[0];
      let chLngth = allQty.filter(aq => aq.list_id == mainQty.list_id && !aq.isParent);
      allQty.map(val => {
        val.extCost = val.splitQty * val.cost;
        val.extCube = val.splitQty * val.cube;
        val.cbm = val.extCube / 35.315
        if (val.webId == '')
          val.webId = clp.po + '-' + clp.poLine + '-00' + (chLngth.length + 1);
      })
      let lastIndex = this.cpls.findIndex(x => x.list_id == clp.list_id) + (allQty.length >= 1 ? allQty.length - 1 : 0);
      let totalQty = allQty.reduce((a, b) => a += b.splitQty, 0);

      if (totalQty > mainQty.qty) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Split qty can not be greater than & equal its actual value', life: 3000 });
        return;
      } else if (totalQty < mainQty.qty) {
        let diff = mainQty.qty - totalQty;
        let newClp: CLPS = JSON.parse(JSON.stringify(clp));
        delete newClp.id
        newClp.shipId = '';
        newClp.etd = null;
        newClp.eta = null;
        newClp.erd = null;
        newClp.rrd = null;
        newClp.splitQty = diff;
        newClp.isParent = false;
        newClp.poLine = ''
        newClp.qty = null;
        newClp.webId = clp.po + '-' + mainQty.poLine + '-00' + (chLngth.length + 2);
        newClp.extCost = diff * newClp.cost;
        newClp.extCube = diff * newClp.cube;
        newClp.splitFrom = clp.webId;
        newClp.cbm = (diff * newClp.cube) / 35.315;
        this.cpls.splice(lastIndex + 1, 0, newClp);
      } else if (totalQty == clp.qty) {
      }
    }

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
      // cl.rrd = this.convertToDate(cl.rrdDt);
      // cl.erd = this.convertToDate(cl.erdDt);
      // cl.etd = this.convertToDate(cl.newEtd);
      // cl.qty = cl.splitQty;
    })
    this.btnDisabled = true
    this.clpsService.addAllClp(newClps).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this.btnDisabled = false;
        this.loadCustomers();
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

  deleteRow(obj: CLPS) {
    let objInx = this.cpls.findIndex(fl => fl.webId == obj.splitFrom)
    if (objInx == -1) {
      objInx = this.cpls.findIndex(fl => fl.po == obj.po && fl.isParent)
    }
    this.cpls[objInx].splitQty += obj.splitQty
    this.cpls[objInx].extCube = this.cpls[objInx].splitQty * obj.cube;
    this.cpls[objInx].extCost = this.cpls[objInx].splitQty * obj.cost;
    this.cpls[objInx].cbm = this.cpls[objInx].extCube / 35.315;
    // this.cpls.map(fl => {
    //   if (fl.list_id == obj.list_id && fl.webId == obj.splitFrom) {
    //     fl.splitQty += obj.splitQty;
    //     fl.amount += obj.amount
    //   } 
    // });

    const index = this.cpls.indexOf(obj);
    if (index > -1) {
      this.cpls.splice(index, 1);
    }
  }


  getExcel(typeFile) {
    if (this.cpls.length > 0) {
      let newClps = this.cpls.filter(nc => nc.id)
      if (typeFile == 'CSV')
        this.loadCsvFile = true;
      else
        this.loadExlFile = true;
      // newClps = [...newClps];
      newClps = newClps.map(e => ({ ...e }))
      newClps.map(cl => {
        cl.poDate = this.convertToDate(cl.poDate);
        cl.dateCreated = this.convertToDate(cl.dateCreated);
        cl.rrd = this.convertToDate(cl.rrd);
        cl.erd = this.convertToDate(cl.erd);
        cl.etd = this.convertToDate(cl.newEtd);
        cl.eta = this.convertToDate(cl.eta);
        // cl.qty = cl.splitQty;
      })
      let ids : any;
      ids = this.cpls.reduce((a, b) => a += b.id + ',', '').split(',');
      ids.splice(-1, 1);
      let searchdata: any = this.exportbody;
      searchdata.totalElements = this.paging.totalElements;
      searchdata.size = this.paging.totalElements;
      searchdata.pageNo = 0;
    ids.pageNo = 0;
      this.clpsService.downloadFileForClpInfo(searchdata,typeFile).subscribe((res) => {
        this.loadExlFile = false;
        this.loadCsvFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (typeFile == 'xls') {
          a.download = `clps-daily-POS.xlsx`;
        }
        else {
          a.download = `clps-daily-POS.csv`;
        }
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a)
        }, 100)
      }, err => {
        this.loadCsvFile = false;
        this.loadExlFile = false;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: ' Oops something went wrong', life: 3000 });
      })
    }
  }

  saveReorderedColumns(event: any) {
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
      valSelected.push(sc.field);
    })
    unSelectedCols.forEach(sc => {
      valUnSelected.push(sc.field);
    })

    let dt = {
      pageName: "ClpInfo",
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
      { isDisplay: false, field: 'poDate', header: 'PO DATE', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'poLine', header: 'PO LINE', type: 'input' },
      { isDisplay: false, field: 'rcp', header: 'RCP#' },
      { isDisplay: false, field: 'shipId', header: 'SHIP ID', type: 'text' },
      { isDisplay: false, field: 'fty', header: 'FTY', type: 'text' },
      { isDisplay: false, field: 'loc', header: 'LOC', type: 'text' },
      { isDisplay: false, field: 'po', header: 'PO', type: 'text' },
      { isDisplay: false, field: 'itemNo', header: 'ITEM NO', type: 'text' },
      { isDisplay: false, field: 'qty', header: 'QTY', type: 'text' },
      { isDisplay: false, field: 'splitQty', header: 'SPLIT QTY', type: 'input' },
      { isDisplay: false, field: 'cost', header: 'COST', type: 'text' },
      { isDisplay: false, field: 'extCost', header: 'EXT COST', type: 'text' },
      { isDisplay: false, field: 'cbm', header: 'CBM', type: 'text' },
      { isDisplay: false, field: 'erd', header: 'ERD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'rrd', header: 'RRD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'eta', header: 'ETA', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'etd', header: 'ETD', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { isDisplay: false, field: 'cont', header: 'CONT', type: 'input' },
      { isDisplay: false, field: 'usc', header: 'USC', type: 'input' },
      { isDisplay: false, field: 'notes', header: 'NOTES', type: 'text' },
      { isDisplay: false, field: 'logo', header: 'LOGO', type: 'text' },
      { isDisplay: false, field: 'htsValue', header: 'HTS VALUE', type: 'text' },
      { isDisplay: false, field: 'htsCode', header: 'HTS CODE', type: 'text' },
      { isDisplay: false, field: 'fdaDesc', header: 'FDA DESC', type: 'text' },
      { isDisplay: false, field: 'consignee', header: 'CONSIGNEE', type: 'text' },
      { isDisplay: false, field: 'tariffCode', header: 'TAREFF CODE', type: 'text' },
      { isDisplay: false, field: 'tariffValue', header: 'TARIFF VALUE', type: 'text' },
      { isDisplay: false, field: 'Action', header: 'ACTION', isEditable: false, type: 'text' }
    ]
    this.defaultColumnsPop = true;
  }
  hideDefaultDialog() {
    this.defaultColumnsPop = false;
  }

  saveDefault() {
    this.loadingDefaultCol = true;
    let val = [];
    this.columnArr.forEach(sc => {
      val.push(sc.field);
    })
    let dt = {
      pageName: "Clp",
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
      icon: 'sidemenu-icon ti-info-alt',
      url: "/clps/clp-info",
      shortcutName: "Clp Info",
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
    this.dtMmgmtService.getSortcutName('Clp Info').subscribe((res) => {
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

  refreshRepo() {
    this.loadData = true;
    this.dtMmgmtService.getFreshData().subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        this.loadCustomers();
      }
      this.loadData = false;
    }, (error) => {
      this.loadData = false;
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });

    })
  }

  loadRepo() {
    this.loadCustomers();
  }

  onBlurMethod(event) {
    this.endDate = new Date();
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