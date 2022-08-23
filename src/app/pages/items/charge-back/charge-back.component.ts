import { Component, Input, OnInit, ViewChild, Pipe, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ItemsService } from 'src/app/services/items.service';
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
import { Table } from 'primeng/table';
import { UserService } from 'src/app/services/user.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { OnlyNumberDirective } from 'src/app/helpers/input-directive/only-number.directive';

declare var $: any;

@Component({
  selector: 'app-charge-back',
  templateUrl: './charge-back.component.html',
  styleUrls: ['./charge-back.component.css'],
  providers: [CurrencyPipe]
})

export class ChargeBackComponent implements OnInit {
  @ViewChild('closable') closable;
  @ViewChild('dt', { static: false }) paginator: Table;
  @ViewChild('pdialog') pdialog;
  @ViewChildren('inputt') inputt : QueryList<ElementRef>;
  locs:any[] = [ '', { loc:'CA' },{ loc:'NY' },{ loc:'CAD' },{ loc:'NYD' },{ loc:'IT' },{ loc:'CIT' }]
  problemDesc: string;
  Nbtn: boolean = false
  hideBt: boolean = false
  uservalueEntered:boolean = false
  hideBtt: boolean = false
  isShowBtn: boolean = false
  isShow: boolean = false;
  isDelete: boolean = true;
  isdate: boolean = false
  isDeleteApi: boolean = false;
  isSubmit: boolean = false;
  isArchived: boolean = true
  isEdit: boolean = false;
  isEditt: boolean = false
  isedit: boolean = true;
  BtnTrue: boolean = false
  isDateSub: boolean = false;
  btnhide: boolean = false
  myGroup: FormGroup;
  user: Users;
  isCheck: boolean = false
  isConfom: boolean = true;
  isConf: boolean = false
  isAppr: boolean = false
  isApprvl: boolean = true
  hideBttton: boolean = true
  hidebtn: boolean = true
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
  columns1: any[] = [];
  selectFilter = 'And';
  toShowPagination: boolean = false;
  date2: Date;
  Appbtnhide: boolean = false
  dates: Date[];
  invalidDates: Array<Date>;
  rangeDates: Date[];
  minDate: Date;
  hide: boolean = false;
  selectedOp: { op?: string };
  maxDate: Date;
  cpls: CLPS[];
  loading: boolean = false;
  editableObject: CLPS;
  clpsDialogue: boolean = false;
  submitted: boolean = false;
  submit: boolean = false;
  itemLoading: boolean;
  date3: Date;
  btn: boolean = false
  uploadedFiles: any[] = [];
  isDisplay: boolean = true;
  selectedProducts: any[];
  hidedata: boolean = false
  actions = {

    canEditPop: false,
    canAddPoup: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canArchive: false,
    canUpload: false,
    canSave: false,
    canImportCsv: false,
    canImportExl: false,
    canImportPSD: false,

    newTabActive: false,
    chinaTabActive: false,
    finalTabActive: false,
    historyTabActive: false,
    archiveTabActive:false,
    viewAllTab:false,

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
  Appbtnhi: boolean = false;
  isDel1: boolean = false;
  isDel2: boolean = false;

  btnText: string = 'Save';
  totalRecords: number = 0;
  page: Page = new Page();
  MAX_SIZE: number = 20;
  btnDisabled: boolean = false;
  private keyUpFxn = new Subject<any>();
  searchFTYNo: string = '';
  searchITEMNO: string = '';
  searchDateIssued: Date;
  searchShpTid: string = '';
  searchShipID: string = '';
  searchExpShip: string = '';
  searchShipNo: string = '';
  searchRCPNo: string = '';
  cust: any[];
  istrue: boolean = false;
  selectedNodes1: any[] = [];
  searchStatus: string = '';
  cols: any[] = [];
  colss: any[] = [];
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
  searchPONo: string;
  item: any;
  eStr: string;
  columnsArray1: any[];
  exSt: string;
  filter: any;
  filterOptr: any;
  productdetail1: any;
  shipmentDetails1: any;
  searchFields1: any[] = [];
  sortDir1: any;
  sortCol1: any;
  gridFilters1: any;
  filter1: any;
  isfirstLoad = true;
  Subtotal: string;
  pricePerUnit: number;
  Inspection: string;
  isBtn: boolean = false;
  IsBtn: boolean = true;
  paging:any;
  Limit = 2;
  startFrom: number;
  row:any[] = [
    {
      id: '',
      itemNo: '',
      poNo: '',
      qty: '',
      problemDesc: '',
      // labourCost: '',
      pricePerUnit: '',
      itemCost: '',
      //claimCharge: '',
      fk_ChargebackId: '',
    },
  ];
  qty: number;
  rcp: string;
  shipId: string;
  loc: string;
  containerNo: string;
  vendorNo: string;
  itemNo: string;
  poNo: string;

  fty: string;
  // obj:any;
  obj: {
    id: string;
    itemNo: string;
    poNo: string;
    qty: string;
    problemDesc: string;
    //labourCost: string;
    pricePerUnit: string;
    //claimCharge: string;
    itemCost: string;
    fk_ChargebackId: string;
  };
  checkk: boolean = false
  qtytotal: number = 0;
  qtyValue: number = 0;
  claimstotal: number = 0;
  ItemCosttotal: number = 0;
  deductFrom: string;
  grandtotal: number = 0;
  lctotal: number = 0;
  chargeId: any;
  data12: any = [];
  data: any;
  id: any;
  rowId: any;
  price: any;
  date: any;
  check: boolean;
  overRideCheck:boolean = false;
  pending :any = '0';
  submi :any = '0';
  pendingApp :any = '0';
  approved :any = '0';
  archive :any = '0';
  ab: {
    id: string;
    itemNo: string;
    poNo: string;
    qty: string;
    problemDesc: string;
    // labourCost: string;
    pricePerUnit: string;
    itemCost: string;
    // claimCharge: string;
    fk_ChargebackId: string;
  };
  searchObj: { val: string; type: any; };
  cloBtn: boolean = false;
  private _startDate: Date;
  da: string;
  searchDateIss: string;
  clpss: any;
  clp: any;
  cp: any;
  clonnedObj: any;
  isCon: any;
  isAp: any;
  Addbtn: boolean = false;
  // myGroup: any;
  isMenuOpen = false;
  allowClose: boolean = false;

  private updateModelSub = new Subject<any>();

  index: number = 0;
  private sub: any;
  ftydpw: any;
  logSectionData: any;
  labourEdit: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private service: Service,
    private itemService: ItemsService,
    private userService: UserService,
    private toastr: ToastrManager,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clpsService: ClpsService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService,
    private itemServices: ItemsService,
    private formBuilder: FormBuilder,
    private currencyPipe : CurrencyPipe
  ) {
    this.user = this.userService.tokenKey.user;
    this.setPage();
    this.ftyitem();
    this.getShortCutStatus();
    this.loadCustomers();

    this.updateStats();

    this.cols = [
      { field: 'chargebackId', header: 'Chargback ID' },
      // {
      //   field: 'dateIssued',
      //   header: 'Date Issued',
      //   data: true,
      //   format: `MM/dd/yyyy`,
      // },
      { field: 'shipId', header: 'Ship Id' },
      { field: 'rcp', header: 'RCP#' },
      { field: 'containerNo', header: 'Container#' },
      { field: 'vendorNo', header: 'Vendor#' },
      { field: 'fty', header: 'FTY' },
      { field: 'loc', header: 'LOC' },
      { field: 'deductFrom', header: 'Deduct From' },
      // { field: 'chargebackNotes', header: 'Chargeback Notes' },
      { field: 'chinaNotes', header: 'CNO Notes' },
      { field: 'apNotes', header: 'NYO Notes' },
      // { field: 'additionalNotes', header: 'Additional Notes' },
    ];
    this.colss = [
      { field: 'chargebackId', header: 'Chargback ID' },
      {
        field: 'dateIssued',
        header: 'Date Issued',
        data: true,
        format: `MM/dd/yyyy`,
      },
      { field: 'shipId', header: 'Ship Id' },
      { field: 'rcp', header: 'RCP#' },
      { field: 'containerNo', header: 'Container#' },
      { field: 'vendorNo', header: 'Vendor#' },
      { field: 'fty', header: 'FTY' },
      { field: 'loc', header: 'LOC' },
      { field: 'deductFrom', header: 'Deduct From' },
      // { field: 'chargebackNotes', header: 'Chargeback Notes' },
      { field: 'chinaNotes', header: 'CNO Notes' },
      { field: 'apNotes', header: 'NYO Notes' },
      // { field: 'additionalNotes', header: 'Additional Notes' },
    ];

    this.updateModelSub.pipe(debounceTime(500)).subscribe((data) => {
      this.updateInspectioin(data);
    });


  }

  updateStats() {
    this.itemService.badgesfortab().subscribe((res:any)=>{
      this.pending = res.data.pending;
      this.submi = res.data.submitted;
      this.pendingApp = res.data.pendingAppr;
      this.approved =res.data.approved;
      this.archive =res.data.archive;
    })
  }
  displayModal: boolean;

  displayBasic: boolean;

  displayBasic2: boolean;

  displayMaximizable: boolean;

  displayPosition: boolean;
  chinaComments: string;
  approvalComments: string;
  // aditionalComments: string;
  chargebackcomments: string;
  position: string;
  isShown: boolean = false; // hidden by default

  displayShipped: boolean;
  displayShimentDetails: boolean;
  currentTab: number;
  toggleShow() { }
  ngOnInit(): void {

    this.primengConfig.ripple = true;

    this.actions = {
      canEditPop: this.permissionService.getPermissionStatus(72),
      canAddPoup: this.permissionService.getPermissionStatus(71),
      canAdd: this.permissionService.getPermissionStatus(31),
      canEdit: this.permissionService.getPermissionStatus(33),
      canDelete: this.permissionService.getPermissionStatus(73),
      canArchive: this.permissionService.getPermissionStatus(79),
      canUpload: this.permissionService.getPermissionStatus(39),
      canSave: this.permissionService.getPermissionStatus(43),
      canImportExl: true,
      canImportCsv: true,
      canImportPSD: true,

      newTabActive: this.permissionService.getPermissionStatus(74),
      chinaTabActive: this.permissionService.getPermissionStatus(75),
      finalTabActive: this.permissionService.getPermissionStatus(76),
      historyTabActive: this.permissionService.getPermissionStatus(77),
      archiveTabActive: this.permissionService.getPermissionStatus(79),
      viewAllTab:this.permissionService.getPermissionStatus(80)
    };

    let allTabs = ['newTabActive', 'chinaTabActive', 'finalTabActive', 'historyTabActive', 'archiveTabActive','viewAllTab'];
    // ['newTabActive', 'chinaTabActive', 'finalTabActive', 'historyTabActive'].some((item, i) => {
    //   if (this.actions[item]) {
    //     this.currentTab = i + 1;
    //     return;
    //   }
    // })

    for (let i = 0; i <= allTabs.length; i++) {
      // I'm looking for the index i, when the condition is true
      if (this.actions[allTabs[i]]) {
        this.currentTab = i + 1;
        break;       // <=== breaks out of the loop early
      }
    }

    this.debounceApi.pipe(debounceTime(500)).subscribe((data) => { });

  }
  setPage() {
    this.paging = {
      totalElements: 0,
      totalPages: 0,
      pageSize: 25,
      pageNumber: 0,
    }
  }
  close() {
    window.close();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  getMonthCust(mth) {
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

  getDate(dt: Date) {
    return `${dt.getMonth() + 1}-${dt.getDate()}-`;
  }
  // set DateIssued(date: Date) {
  //   this._startDate = date;
  // }
  // get DateIssued(): Date {
  //   return this._startDate;
  // }

  clearNew(tab:number) {
    this.searchDateIssued = null;
    this.searchRCPNo = '';
    this.searchShipID = '';
    // this.searchPONo = '';
    this.searchFTYNo = '';
    this.searchITEMNO = ''
    if(tab ==1 )
    this.loadCustomers();
    else if(tab == 2)
    this.loadChinaCustomer();
    else if(tab ==3)
    this.loadFinalAproval();
    else if(tab ==4)
    this.loadHistory();
    else
    this.loadArchieve();
    this.currentTab = tab;
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
  changeTab(tab) {
    if (tab !== this.currentTab) {
      this.clearNew(tab);
      // this.currentTab = tab;
      //this.clearAndGetNew();
    }
  }

  grandTotal(data) {
    if (data.problemDesc == 'SHORTAGE') {
      data.itemCost = data.qty * - this.transformNum(data.pricePerUnit);
      this.ItemCosttotal = 0;
      this.row.forEach((element) => {
        if (element.itemCost)
          this.ItemCosttotal += parseFloat(element.itemCost);
      });
    }
    else if (data.problemDesc == 'OVERAGE') {
      data.itemCost = data.qty * this.transformNum(data.pricePerUnit);
      this.ItemCosttotal = 0;
      this.row.forEach((element) => {
        if (element.itemCost)
          this.ItemCosttotal += parseFloat(element.itemCost);
      });

    }
    else {
      data.itemCost = data.qty * this.transformNum(data.pricePerUnit);
      this.ItemCosttotal = 0;
      this.row.forEach((element) => {
        if (element.itemCost)
          this.ItemCosttotal += parseFloat(element.itemCost);
      });

    }

    this.updateTotal();
  }

  updateTotal(islabour?: boolean) {
    setTimeout(() => {
    if(this.overRideCheck) {
        this.labourEdit = true;
    }
    if (this.istrue) {
      this.claimstotal = +this.ItemCosttotal;
    }
    else {
      this.claimstotal = this.ItemCosttotal + this.lctotal;
      
    }
  }, 100);

  }
  updateInspectioin(data) {
    //this.qtytotal=0
    setTimeout(() => {
      this.grandTotal(data);
      this.qtytotal = 0;
      this.qty = 0
      this.row.forEach((element) => {
        if (element.qty) this.qtytotal += Math.abs(parseInt(element.qty));

      });
      if(this.overRideCheck) { 
        
      }else if (this.qtytotal <= 0) {
        this.lctotal = 0;
      }
      else if (this.qtytotal <= 16) {
        this.lctotal = -50;
      }else {
        this.lctotal = -3 * this.qtytotal;
      }

    }, 100);
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  decimalFilter1(event: any) {
    const reg = /[0-9\+\ ]/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  validateRow() {
    if(!this.row || !this.row.length) {
      return false;
    } else {
      let isValid = true;
      this.row.forEach(item => {
        if(!item.itemNo || !item.qty || !item.poNo || !this.transformNum(item.pricePerUnit)) {
          isValid = false;
        }
      })
      return isValid;
    }
  }
  AddclaimPop() {
    if(this.currentTab == 3){
      if(!this.approvalComments) {
        this.submit = true;
        return;
      }
    }
    
    if(!this.validateForm()) {
      return;
    }
    this.isBtn = false;
    this.isDel2 = false
    this.submit = true

    if (!this.date) {
      this.isConf = false
      this.isAppr = false
    }
    else if (this.isCon == false && this.isAp == false) {
      this.isConf = false
      this.isAppr = false
    }

    else if (this.isCon == true && this.isAp == false) {
      this.isConf = true

      this.isAppr = false
    }
    else if (this.isAp == true) {
      this.isConf = true
      this.isAppr = true

    }

    let body = {
      id: '' || this.id,
      chargebackId: this.shipId + '-CB-' + this.fty,
      dateIssued: '' || this.date,
      fty: this.fty,
      isFeeWaved: this.istrue,
      rcp: this.rcp,
      shipId: this.shipId,
      loc: this.loc,
      containerNo: this.containerNo,
      vendorNo: this.vendorNo,
      deductFrom: this.deductFrom,
      chargebackNotes: this.chargebackcomments,
      chinaNotes: this.chinaComments,
      apNotes: this.approvalComments,
      isManagerAppr: this.isCheck,
      // additionalNotes: this.aditionalComments,
      qtyTotal: this.qtytotal,
      labourCostTotal: this.lctotal,
      itemsCostTotal: this.ItemCosttotal,
      // claimSubTotal: this.claimstotal,
      grandTotal: this.claimstotal,
      isConfirmed: this.isConf,
      isApproved: this.isAppr,
      items: this.row,
    };
    this.isSubmit = false;
    this.clpsService.ChargeClaim(this.isSubmit, body).subscribe((res) => {
      this.isEdit = false;
      this.isedit = true;
      this.isShowBtn = false
      this.displayMaximizable = false;
      this.isBtn = false;
      this.updateStats();
      if (!this.date) {
        this.loadCustomers();
      }
      else if (this.isCon == false && this.isAp == false) {
        this.loadChinaCustomer();
      }

      else if (this.isCon == true && this.isAp == false) {
        this.loadFinalAproval();
      }
      else if (this.isAp == true) {
        this.loadHistory();
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Claim Added Successfully',
        life: 3000,
      });
    });

  }


  approvalPop(resubmit = false) {
    if(!this.validateForm()) {
      return;
    }
    // this.isCheck = false;
    this.isEdit = true;
    this.hideBt = false
    this.submitted = true;
    this.Appbtnhide = false
    this.isShowBtn = true
    this.isBtn = true;
    let body = {
      id: this.id,
      chargebackId: this.shipId + '-CB-' + this.fty,
      dateIssued: this.date,
      fty: this.fty,
      isFeeWaved: this.istrue,
      rcp: this.rcp,
      shipId: this.shipId,
      loc: this.loc,
      containerNo: this.containerNo,
      vendorNo: this.vendorNo,
      deductFrom: this.deductFrom,
      chargebackNotes: this.chargebackcomments,
      chinaNotes: this.chinaComments,
      apNotes: this.approvalComments,
      // additionalNotes: this.aditionalComments,
      qtyTotal: this.qtytotal,
      isManagerAppr: this.isCheck,
      labourCostTotal: this.lctotal,
      itemsCostTotal: this.ItemCosttotal,
      claimSubTotal: this.claimstotal,
      grandTotal: this.claimstotal,
      isConfirmed: resubmit ? false : this.isConfom,
      isApproved: resubmit ? false : this.isApprvl,
      items: this.row,
    };
    this.isSubmit = true;
    this.clpsService.ChargeClaim(this.isSubmit, body).subscribe((res) => {
      this.isDateSub = true;
      this.hideBt = false
      this.displayMaximizable = false;
      this.isShowBtn = true
      this.isBtn = true;
      this.isEdit = true;
      this.isCheck = false;
      this.loadFinalAproval();


      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Claim Added Successfully',
        life: 3000,
      });
      this.updateStats();
      this.isDateSub = true;

    });
  }
  ConformPop() {
    if(!this.validateForm()) {
      return;
    }
    this.isEdit = true;
    this.isShowBtn = false
    this.isBtn = true;
    this.submitted = true;

    let body = {
      id: this.id,
      chargebackId: this.shipId + '-CB-' + this.fty,
      dateIssued: this.date,
      fty: this.fty,
      isFeeWaved: this.istrue,
      rcp: this.rcp,
      shipId: this.shipId,
      loc: this.loc,
      containerNo: this.containerNo,
      vendorNo: this.vendorNo,
      deductFrom: this.deductFrom,
      chargebackNotes: this.chargebackcomments,
      chinaNotes: this.chinaComments,
      apNotes: this.approvalComments,
      isManagerAppr: this.isCheck,
      // additionalNotes: this.aditionalComments,
      qtyTotal: this.qtytotal,
      labourCostTotal: this.lctotal,
      itemsCostTotal: this.ItemCosttotal,
      claimSubTotal: this.claimstotal,
      grandTotal: this.claimstotal,
      isConfirmed: this.isConfom,
      isApproved: this.isAppr,
      items: this.row,
    };
    this.isSubmit = true;
    this.clpsService.ChargeClaim(this.isSubmit, body).subscribe((res) => {
      this.isDateSub = true;
      this.displayMaximizable = false;
      this.isShowBtn = false
      this.isBtn = true;
      this.isEdit = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Claim Added Successfully',
        life: 3000,
      });
      this.isDateSub = true;
      this.updateStats();

      this.loadChinaCustomer();



    });
    // }
  }

  validateForm() {
    if (!this.rcp || !this.fty || !this.shipId || !this.containerNo || !this.loc ||
      !this.vendorNo || !this.validateRow()) {
      this.submit = true
      return false;
    }
    return true;
  }
  SubmitPoup() {
    if(!this.validateForm()) {
      return;
    }

    this.isShowBtn = false
    this.isBtn = true;
    this.isDel2 = true
    this.isEdit = false;

    if (this.date) {
      this.isDateSub = true;
      return;
    }

    this.submitted = true;

    let body = {
      id: this.id,
      chargebackId: this.shipId + '-CB-' + this.fty,
      dateIssued: this.date,
      fty: this.fty,
      isFeeWaved: this.istrue,
      rcp: this.rcp,
      shipId: this.shipId,
      loc: this.loc,
      containerNo: this.containerNo,
      vendorNo: this.vendorNo,
      deductFrom: this.deductFrom,
      chargebackNotes: this.chargebackcomments,
      chinaNotes: this.chinaComments,
      apNotes: this.approvalComments,
      isManagerAppr: this.isCheck,
      // additionalNotes: this.aditionalComments,
      qtyTotal: this.qtytotal,
      labourCostTotal: this.lctotal,
      itemsCostTotal: this.ItemCosttotal,
      claimSubTotal: this.claimstotal,
      grandTotal: this.claimstotal,
      isConfirmed: this.isConf,
      isApproved: this.isAppr,
      items: this.row,
    };
    this.isSubmit = true;
    this.clpsService.ChargeClaim(this.isSubmit, body).subscribe((res) => {
      this.isDel2 = true
      this.isDateSub = true;
      this.displayMaximizable = false;
      this.isShowBtn = false
      this.isBtn = true;
      this.isEdit = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Claim Added Successfully',
        life: 3000,
      });
      this.updateStats();
      this.isDateSub = true;
      if (!this.date) {
        this.loadCustomers();
      } else {
        this.loadChinaCustomer();
      }
    });
    //}
  }

  clearAndGetNew() {
    this.page = new Page();
    this.totalRecords = 0;
  }
  chargeid() {
    this.chargeId = this.shipId + '-CB-' + this.fty;
  }

  closeAndSave(event?) {
    if (!this.allowClose) {
      this.displayMaximizable = false;
      this.allowClose = false;
      return
    }
    this.confirmationService.confirm({
      message: 'Do you want to save the information?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.AddclaimPop();
        this.displayMaximizable = false;
        this.allowClose = false;

        if (!this.date) {
          this.loadCustomers();
        }
        else if (this.isCon == false && this.isAp == false) {
          this.loadChinaCustomer();
        }

        else if (this.isCon == true && this.isAp == false) {
          this.loadFinalAproval();
        }
        else if (this.isAp == true) {
          this.loadHistory();
        }

        this.displayMaximizable = false;
        this.allowClose = false;


      },
      reject: () => {
        // this.myGroup.reset();
        this.displayMaximizable = false;
        this.allowClose = false;

      },
    });

    //event.preventDefault();
  }

  //  getDateYear(dt: Date){
  //    return`${this.getMonthCust(this.searchDateIssued.getMonth()+1)}-${this.getMonthCust(this.searchDateIssued.getDate())}-${this.searchDateIssued.getFullYear()}`;
  //  }
  getDateYear(dt: Date) {
    return `${this.searchDateIssued.getFullYear()}-${this.getMonthCust(this.searchDateIssued.getMonth() + 1)}-${this.getMonthCust(this.searchDateIssued.getDate())}`;
  }
  loadCustomers(event?: LazyLoadEvent) {
    this.isEdit = false;
    this.isShowBtn = false
    this.isBtn = false;
    this.btn = true
    this.Nbtn = false
    this.isdate = true
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
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

    if (this.searchRCPNo?.trim()) {
      searchFields.push({ fieldName: 'rcp', fieldVal: this.searchRCPNo });
    }
    if (this.searchShipID?.trim()) {
      searchFields.push({ fieldName: 'shipId', fieldVal: this.searchShipID });
    }
    if (this.searchPONo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    }
    if (this.searchFTYNo?.trim()) {
      searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;
    // } else {
    //   this.page.pageNumber = 0;
    //   this.page.size = this.page.size ? this.page.size : 20;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      filterOptr: this.selectFilter,
      // dateFields:[],
      searchFields: searchFields,
    };
    this.itemService.getChargeBack(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.hideBt = false
        this.cpls = res.data;
        this.btn = true
        this.loading = false;
        this.Appbtnhi = true
        this.Addbtn = false
        this.btnhide = true
        this.BtnTrue = false
        this.Appbtnhide = false
        this.isShowBtn = false
        this.isBtn = false;
        this.isEdit = false;
        //this.loadCustomers();
        // this.pending = res.totalElements;
        if (res.data > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        } else if (res.data < 0) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: res.message,
            life: 3000,
          });
        }

        this.totalRecords = res.totalElements;
        this.paging.pageNumber = res.pageNumber;
        this.paging.totalPages= res.totalPages;
        this.paging.totalElements = res.totalElements;
        this.paging.pageSize = res.size
        
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
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

      let body = {
        searchFields: this.searchFields1,
        //dateFields:this.dateFields1,
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      this.service.getChargeBackPdf(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `Sheet1-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `Sheet1-${this.currentDate}.csv`;
          } else a.download = `ChargeBackClaims-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadCsvFile = false;
          this.loadExlFile = false;
          this.loadPdfFile = false;
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

  getExcelChina(type) {

    if (this.cpls.length > 0) {
      let newClps = this.cpls.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        searchFields: this.searchFields1,
        //dateFields:this.dateFields1,
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      this.service.getChargeBackChina(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `Sheet1-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `Sheet1-${this.currentDate}.csv`;
          } else a.download = `ChargeBackClaims-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadCsvFile = false;
          this.loadExlFile = false;
          this.loadPdfFile = false;
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
  getExcelFinalApproval(type) {

    if (this.cpls.length > 0) {
      let newClps = this.cpls.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        searchFields: this.searchFields1,
        //dateFields:this.dateFields1,
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      this.service.getChargeBackFinalApp(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `Sheet1-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `Sheet1-${this.currentDate}.csv`;
          } else a.download = `ChargeBackClaims-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadCsvFile = false;
          this.loadExlFile = false;
          this.loadPdfFile = false;
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
  getExcelHistory(type) {

    if (this.cpls.length > 0) {
      let newClps = this.cpls.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        searchFields: this.searchFields1,
        //dateFields:this.dateFields1,
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      this.service.getChargeBackHistory(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `Sheet1-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `Sheet1-${this.currentDate}.csv`;
          } else a.download = `ChargeBackClaims-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadCsvFile = false;
          this.loadExlFile = false;
          this.loadPdfFile = false;
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
    // if (this.row.length > 0) {
    //   let newClp = this.productdetail1.filter((nc) => nc.id);
    if (type == 'xlsx') {
      this.loadExlFile = true;
    } else if (type == 'csv') {
      this.loadCsvFile = true;
    } else {
      this.loadPdfFile = true;
    }

    let id
    id = this.id

    this.service.getChargeBackPdfPopup(type, id).subscribe(
      (res) => {
        this.loadExlFile = false;
        this.loadCsvFile = false;
        this.loadPdfFile = false;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        if (type == 'xlsx') {
          a.download = `Sheet1-${this.currentDate}.xlsx`;
        } else if (type == 'csv') {
          a.download = `Sheet1-${this.currentDate}.csv`;
        } else a.download = `ChargeBackClaims-${this.currentDate}.pdf`;

        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      },
      (err) => {
        this.loadExlFile = false;
        this.loadCsvFile = false;
        this.loadPdfFile = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: ' Oops something went wrong',
          life: 3000,
        });
      }
    );
    //}
  }

  loadChinaCustomer(event?: LazyLoadEvent) {
    this.isEdit = true;
    this.isdate = false
    this.Nbtn = true
    this.btn = false
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
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
    if (this.searchDateIssued) {
      searchFields.push({ fieldName: 'dateIssued', fieldVal: this.getDateYear(this.searchDateIssued) });
    }

    if (this.searchRCPNo?.trim()) {
      searchFields.push({ fieldName: 'rcp', fieldVal: this.searchRCPNo });
    }
    if (this.searchShipID?.trim()) {
      searchFields.push({ fieldName: 'shipId', fieldVal: this.searchShipID });
    }
    if (this.searchPONo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    }
    if (this.searchFTYNo?.trim()) {
      searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;
    // } else {
    //   this.page.pageNumber = 0;
    //  this.paging.pageSize = this.paging.pageSize;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      filterOptr: this.selectFilter,
      // dateFields:[],
      searchFields: searchFields,
    };
    this.itemService.getChinaClaims(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.hideBt = false
        this.btnhide = false
        //  this.loadChinaCustomer();
        this.isEdit = true;
        this.Nbtn = true
        this.btn = false
        this.Appbtnhi = false
        this.Addbtn = true
        this.BtnTrue = false
        this.Appbtnhide = true
        this.isdate = false
        this.isShowBtn = false
        this.isBtn = true;
        this.cpls = res.data;
        this.loading = false;
        // this.submi = res.totalElements;
        if (res.data > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        } else if (res.data < 0) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: res.message,
            life: 3000,
          });
        }

        
        this.totalRecords = res.totalElements;
        this.paging.pageNumber = res.pageNumber;
        this.paging.totalPages= res.totalPages;
        this.paging.totalElements = res.totalElements;
        this.paging.pageSize = res.size
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
      }
    });
  }
  loadFinalAproval(event?: LazyLoadEvent) {
    this.isCheck = false;
    this.isdate = false
    this.Nbtn = true
    this.btn = false
    this.isEdit = true;
    //this.btnhide=false
    this.loading = true;

    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
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
    if (this.searchDateIssued) {
      searchFields.push({ fieldName: 'dateIssued', fieldVal: this.getDateYear(this.searchDateIssued) });
    }

    if (this.searchRCPNo?.trim()) {
      searchFields.push({ fieldName: 'rcp', fieldVal: this.searchRCPNo });
    }
    if (this.searchShipID?.trim()) {
      searchFields.push({ fieldName: 'shipId', fieldVal: this.searchShipID });
    }
    if (this.searchPONo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    }
    if (this.searchFTYNo?.trim()) {
      searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;
    // } else {
    //   this.page.pageNumber = 0;
    //   this.page.size = this.page.size ? this.page.size : 20;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      filterOptr: this.selectFilter,
      // dateFields:[],
      searchFields: searchFields,
    };
    this.itemService.getFinalApproval(body).subscribe((res) => {
      this.loading = false;
      this.btnhide = false
      this.BtnTrue = true
      this.Appbtnhi = false
      this.Addbtn = true
      this.Nbtn = true
      this.hideBt = false
      this.Appbtnhide = false
      this.isShowBtn = true
      this.isBtn = true;
      this.isEdit = true;
      this.isCheck = false;
      // this.pendingApp = res.totalElements;
      if (res.statusCode == 200) {
        // this.loadFinalAproval();
        this.cpls = res.data;
        if (res.data > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        } else if (res.data < 0) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: res.message,
            life: 3000,
          });
        }

        this.totalRecords = res.totalElements;
        this.paging.pageNumber = res.pageNumber;
        this.paging.totalPages= res.totalPages;
        this.paging.totalElements = res.totalElements;
        this.paging.pageSize = res.size
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
      }
    });
  }

  loadHistory(event?: LazyLoadEvent) {
    this.isBtn = false;
    this.isEdit = true;
    this.isdate = false
    this.Nbtn = false
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
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
    if (this.searchDateIssued) {
      searchFields.push({ fieldName: 'dateIssued', fieldVal: this.getDateYear(this.searchDateIssued) });
    }

    if (this.searchRCPNo?.trim()) {
      searchFields.push({ fieldName: 'rcp', fieldVal: this.searchRCPNo });
    }
    if (this.searchShipID?.trim()) {
      searchFields.push({ fieldName: 'shipId', fieldVal: this.searchShipID });
    }
    if (this.searchPONo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    }
    if (this.searchFTYNo?.trim()) {
      searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;
    // } else {
    //   this.page.pageNumber = 0;
    //   this.page.size = this.page.size ? this.page.size : 20;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      filterOptr: this.selectFilter,
      // dateFields:[],
      searchFields: searchFields,
    };
    this.itemService.getHistoryClaims(body).subscribe((res) => {
      this.hidedata = true
      this.isBtn = false;
      this.btnhide = false
      this.BtnTrue = false
      this.Nbtn = false
      this.Appbtnhide = false
      this.hideBttton = false
      this.hidebtn = false
      this.isEdit = true;
      // this.approved = res.totalElements;
      if (res.statusCode == 200) {
        this.cpls = res.data;
        this.hideBt = true
        //   this.loadHistory();
        this.loading = false;
        if (res.data > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        } else if (res.data < 0) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: res.message,
            life: 3000,
          });
        }

        this.totalRecords = res.totalElements;
        this.paging.pageNumber = res.pageNumber;
        this.paging.totalPages= res.totalPages;
        this.paging.totalElements = res.totalElements;
        this.paging.pageSize = res.size
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
      }
    });
  }

  addTable() {
    this.obj = {
      id: '',
      itemNo: '',
      poNo: '',
      qty: '',
      problemDesc: 'SHORTAGE',
      // labourCost: '',
      pricePerUnit: '',
      itemCost: '',
      // claimCharge: '',
      fk_ChargebackId: '',
    };
    this.row.push(this.obj);
    setTimeout(() => {
      this.inputt.last.nativeElement.focus();
    }, 100)
  }

  deleteRow(i) {
    if (this.row.length == 1) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Atleast one row is required', life: 3000, });
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.ab = this.row.pop();
        this.row.splice(i, 1);
        // this.qtytotal = 0;
        // this.lctotal = 0;
        // this.claimstotal = 0;
        // this.ItemCosttotal = 0;
        this.updateInspectioin({});
        this.grandTotal({});
      }
    })
  }

  deleteUpdatePopUpRow(data) {
    if (this.row.length == 1) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Atleast one row is required', life: 3000, });
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.loading = true;
        if (!data.id) {
          this.ab = this.row.pop();
          // this.lctotal=0
          // this.claimstotal=0
          // this.ItemCosttotal=0
          this.updateInspectioin({});
          this.grandTotal({});

        }
        this.itemService.deletClaimsRow(data.id).subscribe((res: Response) => {
          if (res.statusCode == 200) {
            if (res.data) {
              this.ab = this.row.pop();
              this.updateInspectioin({});
              this.grandTotal({});
              // this.lctotal=0
              // this.claimstotal=0
              // this.ItemCosttotal=0

              // if (!this.date) {
              //   this.loadCustomers();
              // }
              // else if (this.isCon == false && this.isAp == false) {
              //   this.loadChinaCustomer();
              // }

              // else if (this.isCon == true && this.isAp == false) {
              //   this.loadFinalAproval();
              // }
              // else {
              //   this.loadHistory();
              // }
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: res.message,
                life: 3000,
              });
            } else if (res.data < 0) {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: res.message,
                life: 3000,
              });
            }
          }
        });
      },
    });
  }

  deleteUpdatePopUp() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.loading = true;
        let id = this.id;

        this.itemService.deletClaimsPopUp(id).subscribe((res: Response) => {
          if (res.statusCode == 200) {
            if (res.data > 0) {
              this.displayMaximizable = false;
              this.updateStats();
              if (!this.date) {
                this.loadCustomers();
              }
              else if (this.isCon == false && this.isAp == false) {
                this.loadChinaCustomer();
              }

              else if (this.isCon == true && this.isAp == false) {
                this.loadFinalAproval();
              } else if (this.currentTab == 5){
                this.loadArchieve();
              }
              else {
                this.loadHistory();
              }


              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: res.message,
                life: 3000,
              });
            } else if (res.data < 0) {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: res.message,
                life: 3000,
              });
            }
          }
        });
      },
    });
  }


  editPop() {

    this.isEdit = !this.isEdit;
    this.isedit = true
    this.hidedata = false
    this.allowClose = true;

  }
  ClickedOut(event) {

    if (event.target.className === "body") {
      this.displayMaximizable = false;
    }

  }



  closeSave() {
    //this.keyFun()
    if (!this.allowClose) {
      this.displayMaximizable = false;
      this.allowClose = false;
      return
    }

    else {
      this.confirmationService.confirm({
        message: 'Do you want to save the information?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.AddclaimPop();

          if (!this.date) {
            this.loadCustomers();
          }
          else if (this.isCon == false && this.isAp == false) {
            this.loadChinaCustomer();
          }

          else if (this.isCon == true && this.isAp == false) {
            this.loadFinalAproval();
          }
          else if (this.isAp == true) {
            this.loadHistory();
          }
          this.displayMaximizable = false;
          this.allowClose = false;



          this.displayMaximizable = false;
          this.allowClose = false;


        },
        reject: () => {

          this.displayMaximizable = false;
          this.allowClose = false;

        },
      });

    }

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

  endAfterStart(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    return endDate.getTime() >= startDate.getTime();
  }
  showMaximizableDialog() {
  
    setTimeout(() => {
      $('.p-component-overlay').on('click', (event) => {
        if ($(event.target).hasClass('p-component-overlay'))
          this.closeAndSave();
      });

    }, 300);

    this.submit = false
    this.istrue = false;
    this.btnhide = true
    this.displayMaximizable = true;
    this.isDelete = true;
    this.isDeleteApi = false;
    this.isBtn = false;
    this.IsBtn = false;
    this.id = '';
    this.row = [];
    this.fty = '';
    this.loc = '';
    this.containerNo = '';
    this.vendorNo = '';
    this.shipId = '';
    this.rcp = '';
    this.deductFrom = '';
    // this.aditionalComments = '';
    this.approvalComments = '';
    this.chinaComments = '';
    this.chargebackcomments = '';
    this.ItemCosttotal = 0;
    this.ItemCosttotal = 0;
    this.qtytotal = 0;
    this.lctotal = 0;
    this.labourEdit = false;
    this.check = false;
    this.istrue = false;
    this.isCheck = false;
    this.claimstotal = 0;
    this.date = '';
    this.isEdit = false;
    this.isedit = false
    this.isDateSub = false;
    this.Appbtnhi = false;
    this.Addbtn = false;
    this.isDel1 = false
    this.isDel2 = false
    this.isShowBtn = false
    this.hideBtt = false

    this.addTable();
    this.row.forEach(dt => {
      dt.problemDesc = 'SHORTAGE';
    })
    // this.isNew=false
    //  this.Appbtnhide=!this.btnhide
  }

  showMaximizableDialog1(rowData) {
    this.allowClose = false;
    this.isBtn = true;

    let objj = this.cpls.filter((x) => x.id === rowData.id)[0].id;

    this.logSectionHistory(objj)
    this.itemService.getClaims(objj).subscribe((res) => {
      if (res.statusCode == 200) {
        setTimeout(() => {
          $('.p-component-overlay').on('click', (event) => {
            if ($(event.target).hasClass('p-component-overlay'))
              this.closeSave();
          });

        }, 300);
        this.row = res.data.items;
        this.row.forEach(itm => {
          itm.pricePerUnit = this.getTransformedValue(itm.pricePerUnit+'');
        })
        // this.rowId=res.data.items.id
        this.rcp = res.data.rcp;
        this.fty = res.data.fty;
        this.check = res.data.isFeeWaved;
        this.istrue = res.data.isFeeWaved;
        this.containerNo = res.data.containerNo;
        this.loc = res.data.loc;
        this.lctotal = res.data.labourCostTotal;
        this.claimstotal = res.data.grandTotal;
        this.ItemCosttotal = res.data.itemsCostTotal;
        this.shipId = res.data.shipId;
        this.qtytotal = res.data.qtyTotal;
        this.vendorNo = res.data.vendorNo;
        this.isCon = res.data.isConfirmed;
        this.isCheck = res.data.isManagerAppr;
        this.isAp = res.data.isApproved;
        this.chargebackcomments = res.data.chargebackNotes;
        // this.aditionalComments = res.data.additionalNotes;
        this.clonnedObj = {
          chargebackcomments: this.chargebackcomments,
          // aditionalComments: this.aditionalComments,
          chinaComments: this.chinaComments,
          approvalComments: this.approvalComments,
          deductFrom: this.deductFrom
        }
        this.chinaComments = res.data.chinaNotes;
        this.approvalComments = res.data.apNotes;
        this.deductFrom = res.data.deductFrom;
        this.date = res.data.dateIssued;
        this.id = res.data.id;

        this.displayMaximizable = true;
        this.isDeleteApi = true;
        this.isDelete = false;
        //this.isEdit = true;
        this.isedit = true;
        //this.isBtn=true;
        this.submit = false;
        this.btnhide || this.BtnTrue || this.Appbtnhide
        this.IsBtn = false
        this.Appbtnhi = true
        this.Addbtn = true;
        if (this.BtnTrue == true) {
          this.hideBt = false
        }
        //this.isCheck=false;
        this.hideBtt = true

      }
    });
  }
  resetPosition() {
    if (this.pdialog) {
      this.pdialog.maximize();
      this.pdialog.resetPosition();
    }
  }

  click() {
    this.istrue = this.check;
    this.updateInspectioin({});
    this.grandTotal({});
  }
  overrRideClick(){
    this.updateTotal()
  }
  appClick() {
    this.isCheck = !this.isCheck;
    this.checkk = !this.isCheck;

  }
  toggleStatus() {
    this.isShow = !this.isShow;
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

  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('CLP').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
      }
    });
  }

  empty() {
    return (
      !this.searchFTYNo &&
      !this.searchDateIssued &&
      !this.searchRCPNo &&
      !this.searchPONo &&
      !this.searchShipID &&
      !this.searchExpShip &&
      !this.filed &&
      !this.pickedSearch
    );
  }

  hidewarningDialog() {
    this.openExtraCol = false;
  }

  disableClose(val) {
    this.allowClose = true;
    
  }

  changed(data, type='', field= '') {
    console.log(data);
    if(type ==  'numonly' && field && data) {
      data[field] = data[field] ? this.checkForNumOnly(data[field]) : data[field];
    }
    this.updateModelSub.next(data);
    // this.updateInspectioin(data);
  }

  checkForNumOnly(val) {
    return val ? `${val}`.replace(/[^0-9\.]/g, '') : val;
  }
  loadArchieve(event?: LazyLoadEvent) {
    this.isBtn = false;
    this.isEdit = true;
    this.isdate = false
    this.Nbtn = false
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
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
    if (this.searchDateIssued) {
      searchFields.push({ fieldName: 'dateIssued', fieldVal: this.getDateYear(this.searchDateIssued) });
    }

    if (this.searchRCPNo?.trim()) {
      searchFields.push({ fieldName: 'rcp', fieldVal: this.searchRCPNo });
    }
    if (this.searchShipID?.trim()) {
      searchFields.push({ fieldName: 'shipId', fieldVal: this.searchShipID });
    }
    if (this.searchPONo?.trim()) {
      searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    }
    if (this.searchFTYNo?.trim()) {
      searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    }
    if (this.searchITEMNO?.trim()) {
      searchFields.push({ fieldName: 'itemNo', fieldVal: this.searchITEMNO });
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;
    // } else {
    //   this.page.pageNumber = 0;
    //   this.page.size = this.paging.pageSize;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      filterOptr: this.selectFilter,
      // dateFields:[],
      searchFields: searchFields,
    };
    this.itemService.getArchieve(body).subscribe((res) => {
      this.hidedata = true
      this.isBtn = false;
      this.btnhide = false
      this.BtnTrue = false
      this.Nbtn = false
      this.Appbtnhide = false
      this.hideBttton = false
      this.hidebtn = false
      this.isEdit = true;
      // this.archive = res.totalElements;
      if (res.statusCode == 200) {
        this.cpls = res.data;
        this.hideBt = true
        //   this.loadHistory();
        this.loading = false;
        if (res.data > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        } else if (res.data < 0) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: res.message,
            life: 3000,
          });
        }

        this.totalRecords = res.totalElements;
        this.paging.totalPages=res.totalPages;
        this.paging.pageNumber = res.pageNumber;
        this.paging.totalElements = res.totalElements;
        this.paging.pageSize = res.size
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
      }
    });
  }
  getExcelArchive(type) {
    if (this.cpls.length > 0) {
      let newClps = this.cpls.filter((nc) => nc.id);
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        searchFields: this.searchFields1,
        //dateFields:this.dateFields1,
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      this.service.archiveFiles(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `Sheet1-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `Sheet1-${this.currentDate}.csv`;
          } else a.download = `ChargeBackArchive-${this.currentDate}.pdf`;

          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        },
        (err) => {
          this.loadCsvFile = false;
          this.loadExlFile = false;
          this.loadPdfFile = false;
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
  archiveButton() {
    this.hideBtt = true
    this.isEdit = true;
    this.hideBt = true
    this.submitted = false;
    this.Appbtnhide = false
    this.isShowBtn = false
    this.isBtn = true;
    let body = {
      id: this.id,
      chargebackId: this.shipId + '-CB-' + this.fty,
      dateIssued: this.date,
      fty: this.fty,
      isFeeWaved: this.istrue,
      rcp: this.rcp,
      shipId: this.shipId,
      loc: this.loc,
      containerNo: this.containerNo,
      vendorNo: this.vendorNo,
      deductFrom: this.deductFrom,
      chinaNotes: this.chinaComments,
      apNotes: this.approvalComments,
      qtyTotal: this.qtytotal,
      isManagerAppr: this.isCheck,
      labourCostTotal: this.lctotal,
      itemsCostTotal: this.ItemCosttotal,
      claimSubTotal: this.claimstotal,
      grandTotal: this.claimstotal,
      isConfirmed: this.isConfom,
      isApproved: this.isApprvl,
      isArchived: this.isArchived,
      items: this.row,
    };
    this.isSubmit = false;
    this.clpsService.ChargeClaim(this.isSubmit, body).subscribe((res) => {
      this.isDateSub = true;
      this.hideBt = false
      this.displayMaximizable = false;
      this.isShowBtn = true
      this.isBtn = true;
      this.isEdit = true;
      this.isCheck = false;


      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Claim Added Successfully',
        life: 3000,
      });
      this.isDateSub = true;
      this.updateStats();
      this.loadHistory()
    });
  }
  pageChanged(e) {
    this.startFrom = null;
    this.startFrom = (e - 1) * this.Limit;
    this.paging.pageNumber = e-1;
    switch (this.currentTab) {
      case 1:
        this.loadCustomers()
        break;
      case 2:
        this.loadChinaCustomer() 
      break;
      case 3:
        this.loadFinalAproval()
      break;
      case 4:
        this.loadHistory()
      break;
      case 5:
        this.loadArchieve()
      break;
    }
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    // this.getDataGridTab1();
   }
   resubmit() {
     this.approvalPop(true);
   }
   ftyitem() {
    this.itemServices.getAllPlainFty().subscribe((res: any) => {
      this.ftydpw = ['', ...res.data];
    });
  }

  fillVendor() {
    let fty = (this.ftydpw && this.ftydpw.length) ? this.ftydpw.filter(item => item.fty == this.fty) : null;
    if(fty && fty.length) {
      this.vendorNo = fty[0].vendId;
    } else {
      this.vendorNo = '';
    }
  }
  logSectionHistory(val){
    console.log(val)
    this.itemService.getAllLogHistory(val).subscribe((res:any)=>{
      console.log(res.data)
      this.logSectionData = res.data
    })
  }
  transformNum(value):any {
    return (!value) ? '' : (value+'').replace(/[$,\,]/g, '');
  }
  remove$(value) {
    return (!value) ? '' : (value+'').replace(/[$]/g, '');
  }
  transformAmount(data){
    let ok =this.getTransformedValue(data.pricePerUnit);
    data.pricePerUnit = ok;
  }

  getTransformedValue(val) {
    return val ? this.remove$(this.currencyPipe.transform(this.transformNum(val), '$')) : val;
  }
}
