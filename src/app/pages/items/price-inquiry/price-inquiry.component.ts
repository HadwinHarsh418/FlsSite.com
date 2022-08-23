import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Category } from 'src/app/models/category';
import { Response } from 'src/app/models/response';
import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PriceInqArr, PriceInquery } from 'src/app/models/price-inquiry';
import { Page } from 'src/app/models/page';
import { FileUpload } from 'primeng/fileupload';
import { ProjectDetialsItem } from 'src/app/models/projectDetialsItem';
import { UserService } from '../../../services/user.service';
import { CLPS } from 'src/app/models/clps';
import { Service } from 'src/app/services/pivot.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Table } from 'primeng/table/table';
import { environment } from "src/environments/environment";
declare var $: any;


@Component({
  selector: 'app-price-inquiry',
  templateUrl: './price-inquiry.component.html',
  styleUrls: ['./price-inquiry.component.css']
})
export class PriceInquiryComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  @ViewChild('projectFileInput') projectFileInput: FileUpload;
  @ViewChild('pdialog') pdialog;
  @ViewChild('dt', { static: false }) paginator: Table;
  @ViewChildren('inputt') inputt : QueryList<ElementRef>;
  priceInqueries: PriceInquery[];
  loading: boolean = true;
  editableObject = new PriceInquery();
  submitted: boolean = false;
  itemLoading: boolean;
  isbtnShow: boolean = false
  isbtnHide: boolean = false
  isBtnSh: boolean = false
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    // canUpload: false
    canEditPop: false,
    canAddPoup: false,
    canUpload: false,
    canSave: false,
    canImportCsv: false,
    canImportExl: false,
    canImportPSD: false,
    viewAll: false
  }
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
  isClick: boolean = true;
  hide: boolean = false;
  cols2: any[] = [];
  // cols1: any[] = [];
  page: Page = new Page();
  totalRecords: number = 0;
  colLength: number = 0;
  statusOption = [{ label: 'All', value: 0 }, { label: 'Open', value: 1 }, { label: 'Completed', value: 2 }];
  assingablestatusOption = [{ label: 'Open', value: 1 }, { label: 'Completed', value: 2 }];

  filterByStatus: any;

  openProject: boolean;
  openAddEditProject: boolean;
  projectItems: ProjectDetialsItem[];
  editableProjectItem: ProjectDetialsItem;
  uploadingAttachments: boolean;
  projectAttachments: any[] = [];
  selectFilter = '';
  user: any;
  currentTab = 1;
  currentsubTab = 1;
  loadCsvFile: boolean = false;
  loadPdfFile: boolean = false;
  loadExlFile: boolean = false;
  btnhide: boolean = false;
  cpls: any;
  colss: any[] = [];
  dt = new Date();
  currentDate =
    this.dt.getDate() +
    '-' +
    (this.dt.getMonth() + 1) +
    '-' +
    this.dt.getFullYear();
  searchFTYNo: string = '';
  searchPONo: string = '';
  searchShpTid: string = '';
  searchShipID: string = '';
  searchExpShip: string = '';
  searchShipNo: string = '';
  searchRCPNo: string = '';
  searchDateIssued: Date;
  isBtn: boolean = false;
  IsBtn: boolean = true;
  isEdit: boolean = false;
  isEditt: boolean = false
  isedit: boolean = true;
  row = [
    {
      id: '',
      itemNo: '',
      desc: '',
      currentPrice: '',
      targetPrice: '',
      fk_PiId: '',
      approvedPrice: ''
    },
  ];
  //cols1: { hidden: boolean; field: string; header: string; }[];
  submit: boolean = false;
  grandtotal: number = 0;
  isDelete: boolean = true;
  ItemCosttotal: number = 0;
  isDeleteApi: boolean = false;
  lctotal: number = 0;
  qtytotal: number = 0;
  obj: any = []
  ab: { id: string; itemNo: string; desc: string; currentPrice: string; targetPrice: string; fk_PiId: string; };
  displayMaximizable = false;
  id: any;
  cols1: any = [];
  objj: string = '';
  price: any;
  old_price: any;
  currentPrice: string;
  priceInquerie: any;
  priceInqueri: any;

  mailSubjectSearch: string = '';
  customerSearch: string = '';
  needRespondByDt: any
  allowClose: boolean = false
  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;

  constructor(
    private toastr: ToastrManager,
    private messageService: MessageService,
    private service: Service,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private itemService: ItemsService,
    private dtMmgmtService: DataManagementService

  ) {

    this.user = this.userService.tokenKey.user;
    this.filterByStatus = this.statusOption[0];
    this.getShortCutStatus();
    this.setPage();
  }

  ngOnInit(): void {
    // this.cols1 = [
    //   { hidden: false, field: 'itemNo', header: 'Item #' },
    //   { hidden: false, field: 'desc', header: 'Description' },
    //   { hidden: false, field: 'currentPrice', header: 'Current Price ',currency:true},
    //   { hidden: false, field: 'targetPrice', header: ' Target Price',currency:true},
    // ]
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(53),
      canEdit: this.permissionService.getPermissionStatus(54),
      canDelete: false,
      canEditPop: true,
      canAddPoup: false,
      canUpload: false,
      canSave: false,
      canImportCsv: false,
      canImportExl: false,
      canImportPSD: false,
      viewAll: this.permissionService.getPermissionStatus(80),

    }


    this.getAllpriceInqueries();
  }
  changeTab(tab) {
    if (tab !== this.currentTab) {
      this.currentTab = tab;
      this.clearNew();
      //this.clearAndGetNew();
    }
  }
  changesubTab(tab) {
    if (tab !== this.currentsubTab) {
      this.currentsubTab = tab;
      this.clearNew();
      //this.clearAndGetNew();
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  deleteUpdatePopUp() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        let id = this.objj;

        this.itemService.deletePriceInPopup(id).subscribe((res: Response) => {
          if (res.statusCode == 200) {
            if (res.data > 0) {
              this.displayMaximizable = false;
              if (this.currentTab == 2) {
                this.getAllSentAproval();
              }

              else if (this.currentTab == 3) {
                this.getAllCompleted();
              }
              else {
                this.getAllpriceInqueries();
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
        }
        this.itemService.deletepriceInqRow(data.id).subscribe((res: Response) => {
          if (res.statusCode == 200) {
            if (res.data) {
              this.ab = this.row.pop();
              if (this.editableObject.isCompleted == true && this.editableObject.isSentForAppr == false) {
                this.getAllSentAproval();
              }

              else if (this.editableObject.isCompleted == true && this.editableObject.isSentForAppr == false) {
                this.getAllCompleted();
              }
              else {
                this.getAllpriceInqueries();
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
            this.loading = false;
          }
        });
      },
    });
  }

  getExcelPop2(type) {
    if (type == 'xlsx') {
      this.loadExlFile = true;
    } else if (type == 'csv') {
      this.loadCsvFile = true;
    } else {
      this.loadPdfFile = true;
    }


    this.service.exportPIItemsData(type, this.objj).subscribe((res) => {
      this.loadExlFile = false;
      this.loadCsvFile = false;
      this.loadPdfFile = false;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      let a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      if (type == 'xlsx') {
        a.download = `ChargeBack-items-${this.currentDate}.xlsx`;
      } else if (type == 'csv') {
        a.download = `ChargeBack-items-${this.currentDate}.csv`;
      } else a.download = `ChargeBack-items-${this.currentDate}.pdf`;

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

  showMaximizableDialog1(rowData) {
    if (this.currentTab == 1) {
      this.btnhide = true
    } else if (this.currentTab == 2) {
      this.btnhide = false
    } else {
      this.btnhide = false


    }
    this.isEdit = false;
    this.objj = this.priceInqueries.filter((x) => x.id === rowData.id)[0].id;
    this.itemService.getPrice(this.objj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.cpls = res.data;
        if (this.cpls && this.cpls.items && this.cpls.items.length) {
          this.cpls.items.forEach(
            itm => itm.currentPrice = parseFloat(itm.currentPrice).toFixed(2)
          )
          this.cpls.items.forEach(
            e => e.targetPrice = parseFloat(e.targetPrice).toFixed(2)
          )
          this.cpls.attachments.forEach(
            e => e.attachmentPath = `${environment.imgUlr}` + '/' + e.attachmentPath
          )

        }
        this.displayMaximizable = true;

        setTimeout(() => {
        this.checkDisablity();

          $('.p-component-overlay').on('click', (event) => {
            if ($(event.target).hasClass('p-component-overlay'))
              this.closeAndSave();
          });
        }, 300);
        this.isDelete = false;
        this.isDeleteApi = true;
        this.row = res.data.items;
        this.editableObject = res.data;


      }
    });
  }

  checkDisablity() {
    if (!this.actions.canEdit) {
      const disableUploadButtons = document.getElementsByClassName('p-fileupload-buttonbar')[0];
      disableUploadButtons.classList.add('uploadDisabled')
    }

  }
  openNew() {
    setTimeout(() => {
    this.checkDisablity();
      $('.p-component-overlay').on('click', (event) => {
        if ($(event.target).hasClass('p-component-overlay'))
          this.closeAndSave();
      });

    }, 300);
    this.objj = '';
    this.editableObject = new PriceInquery();
    // this.editableObject.statusNow = this.assingablestatusOption[0];
    this.submitted = false;
    this.displayMaximizable = true;

    this.row = [{
      id: '',
      itemNo: '',
      desc: '',
      currentPrice: '',
      targetPrice: '',
      fk_PiId: '',
      approvedPrice: '',
    },];
    this.isDelete = true;
    this.isDeleteApi = false;
    this.isbtnShow = true
    this.isBtnSh = false
    this.isbtnHide = false
    this.btnhide = true
  }

  getAllCompleted(event?: LazyLoadEvent) {
    this.isbtnHide = true
    this.isBtnSh = false
    this.btnhide = false
    this.isbtnShow = false
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
    if (this.needRespondByDt) {
      searchFields.push({ fieldName: 'completedOn', fieldVal: this.getDateYear(this.needRespondByDt) });
    }

    if (this.customerSearch?.trim()) {
      searchFields.push({ fieldName: 'customer', fieldVal: this.customerSearch });
    }
    if (this.mailSubjectSearch?.trim()) {
      searchFields.push({ fieldName: 'mailSubject', fieldVal: this.mailSubjectSearch });
    }
    // if (this.searchPONo?.trim()) {
    //   searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    // }
    // if (this.searchFTYNo?.trim()) {
    //   searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    // }
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

      searchFields: searchFields,
    };
    let type: boolean = false
    if (this.currentTab == 3 && this.currentsubTab == 1) {
      type = true
    }
    this.itemService.getAllCompleted(body, type).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        this.isbtnShow = false
        this.btnhide = false
        this.isBtnSh = false
        this.isbtnHide = true
        // this.cols = this.columnsHeader()
        // if (!this.cols.length) {

        this.cols2 = this.columnsHeader();
        //this.cols1 = this.columnsHeaders();
        this.colLength = this.cols2.length;
        // }
        this.priceInqueries = res.data;

        this.totalRecords = res.totalElements;
        this.loading = false;
      }

      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })
  }
  getAllSentAproval(event?: LazyLoadEvent) {

    this.isbtnHide = false
    this.isBtnSh = true
    this.btnhide = false
    this.isbtnShow = true
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
    if (this.needRespondByDt) {
      searchFields.push({ fieldName: 'needRespondBy', fieldVal: this.getDateYear(this.needRespondByDt) });
    }

    if (this.customerSearch?.trim()) {
      searchFields.push({ fieldName: 'customer', fieldVal: this.customerSearch });
    }
    if (this.mailSubjectSearch?.trim()) {
      searchFields.push({ fieldName: 'mailSubject', fieldVal: this.mailSubjectSearch });
    }
    // if (this.searchPONo?.trim()) {
    //   searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    // }
    // if (this.searchFTYNo?.trim()) {
    //   searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    // }
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

      searchFields: searchFields,
    };
    this.itemService.getAllApproval(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        this.isbtnShow = true
        this.btnhide = false

        this.isbtnHide = false
        this.isBtnSh = true
        // this.cols = this.columnsHeader()
        // if (!this.cols.length) {

        this.cols2 = this.columnsHeader();
        //this.cols1 = this.columnsHeaders();
        this.colLength = this.cols2.length;
        // }
        this.priceInqueries = res.data;

        this.totalRecords = res.totalElements;
        this.loading = false;
      }

      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })
  }
  getMonthCust(mth) {
    if (mth < 10) {
      mth = '0' + mth;
    }
    return mth;
  }
  getDateYear(dt: Date) {
    return `${dt.getFullYear()}-${this.getMonthCust(dt.getMonth() + 1)}-${this.getMonthCust(dt.getDate())}`;
  }
  getAllpriceInqueries(event?: LazyLoadEvent) {
    this.isBtnSh = false
    this.btnhide = true
    this.isbtnShow = true
    this.isbtnHide = false
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
    if (this.needRespondByDt) {
      searchFields.push({ fieldName: 'needRespondBy', fieldVal: this.getDateYear(this.needRespondByDt) });
    }

    if (this.customerSearch?.trim()) {
      searchFields.push({ fieldName: 'customer', fieldVal: this.customerSearch });
    }
    if (this.mailSubjectSearch?.trim()) {
      searchFields.push({ fieldName: 'mailSubject', fieldVal: this.mailSubjectSearch });
    }
    // if (this.searchPONo?.trim()) {
    //   searchFields.push({ fieldName: 'poNo', fieldVal: this.searchPONo });
    // }
    // if (this.searchFTYNo?.trim()) {
    //   searchFields.push({ fieldName: 'fty', fieldVal: this.searchFTYNo });
    // }
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

      searchFields: searchFields,
    };
    this.itemService.getAllpriceInqueries(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        this.isBtnSh = false
        this.isbtnShow = true
        this.btnhide = true
        this.isbtnHide = false
        this.cols2 = this.columnsHeader();
        this.colLength = this.cols2.length;
        this.priceInqueries = res.data;
        this.id = res.data.id
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
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.errorToastr('Oops something went wrong!');
      }
    });
  }
  // getAllpriceInqueries(event?: LazyLoadEvent) {
  //   this.loading = true;
  //   let params = '';
  //   let srD = '';
  //   let srC = '';
  //   let ft = {};
  //   if (event && event.globalFilter) params += '&filter=' + event.globalFilter;
  //   if (event && event.sortField) {
  //     srD = (event.sortOrder == 1) ? 'asc' : 'desc';
  //     srC = event.sortField;
  //   }
  //   if (event) {
  //     if (Object.keys(event.filters).length != 0 && event.filters.constructor === Object) {
  //       ft = event.filters
  //     }
  //   }
  //   if (event) {
  //     this.page.pageNumber = event.first / event.rows;
  //     this.page.size = event.rows;

  //   }
  //   else {
  //     this.page.pageNumber = 0
  //     this.page.size = this.page.size ? this.page.size : 20;
  //   }
  //   const body = {
  //     size: this.page.size,
  //     page: this.page.pageNumber,
  //     filter: (event && event.globalFilter) ? event.globalFilter : '',
  //     sortDir: srD,
  //     sortCol: srC,
  //     gridFilters: ft,
  //     Status: this.filterByStatus ? this.filterByStatus.value : 0
  //   }
  //   this.itemService.getAllpriceInqueries(body).subscribe((res) => {   
  //     if (res.statusCode == 200) {
  //       this.cols2 = this.columnsHeader();
  //         this.colLength = this.cols2.length;
  //       this.priceInqueries = res.data;
  //       this.id=res.data.id
  //       this.totalRecords = res.totalElements;
  //       this.loading = false;
  //       if (res.data > 0) {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Successful',
  //           detail: res.message,
  //           life: 3000,
  //         });
  //       } else if (res.data < 0) {
  //         this.loading = false;
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error Message',
  //           detail: res.message,
  //           life: 3000,
  //         });
  //       }

  //       this.totalRecords = res.totalElements;
  //       this.loading = false;
  //     } else {
  //       this.loading = false;

  //     }
  //   })
  // }

  columnsHeader() {
    // this.cols2 = [];
    let columns = [
      { hidden: false, field: 'projectName', header: ' Project Name' },
      { hidden: true, field: 'customer', header: 'Customer' },
      { hidden: false, field: 'dateRequested', header: 'Date Requested', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { hidden: false, field: 'mailSubject', header: 'Email Subject' },
      { hidden: false, field: 'customer', header: 'Customer' },
      { hidden: false, field: 'needRespondBy', header: 'Need Response By', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { hidden: false, field: 'sentForApprovalOn', header: 'Sent for Approval', type: 'date', format: `MM/dd/yyyy`, data: true, },
      { hidden: false, field: 'notes', header: 'Notes' },
      { hidden: false, field: 'createdByName', header: 'Created By' },

    ]
    columns.map(cl => {
      if (this.currentTab == 3 && cl.field == 'needRespondBy') {
        cl.header = 'Completed On'
      }
      if (this.currentTab == 1 && cl.field == 'sentForApprovalOn') {
        cl.hidden = true
      }
    })
    return columns;
  }

  updateActionButtons() {
    this.cols2 = this.columnsHeader()
  }

  deleteProduct(cat: PriceInquery) {
    const nameCapitalized = cat.mailSubject;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.itemService.deletePriceInquiry(cat.id).subscribe((res: Response) => {
          if (res.statusCode == 200 && res.data == 1) {
            //this.getAllpriceInqueries();
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


  editProduct(cat: PriceInquery) {
    this.getFtyById(cat);
  }


  getFtyById(cat) {
    this.loading = true;
    this.itemService.getPriceInquiryById(cat.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        let o = res.data;
        o.needDate = new Date(res.data.needRespondBy)
        if (o.status) {
          o.statusNow = this.assingablestatusOption.filter(item => item.value == o.status)[0];
        } else {
          o.statusNow = this.assingablestatusOption[0];
        }
        o.attachments.map(item => { item.attachmentPath = `${environment.imgUlr}/${item.attachmentPath}` })
        this.editableObject = o;
        // this.displayMaximizable = true;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })


  }
  hideDialog() {
    this.displayMaximizable = false;
    this.submitted = false;
    this.itemLoading = false;
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
  addTable() {
    this.obj = {
      id: '',
      itemNo: '',
      desc: '',
      currentPrice: '',
      targetPrice: '',
      fk_PiId: '',
    };
    this.row.push(this.obj);
    setTimeout(() => {
      this.inputt.last.nativeElement.focus();
    }, 100)
    // let y=[];
    // y.forEach(element => {
    //   this.row.push(element.this.obj);
    // });

  }
  saveProduct(type?) {
    this.submitted = true;
    if (this.editableObject.mailSubject?.trim() && (this.editableObject.needRespondBy)) {
      this.itemLoading = true;
      let formData = new FormData();
      formData.append('id', this.editableObject.id ? this.editableObject.id : '' || this.editableObject.id ? this.editableObject.id : this.objj);
      formData.append('mailSubject', this.editableObject.mailSubject);
      formData.append('customer', this.editableObject.customer);
      formData.append('needRespondBy', this.convertToDate(this.editableObject.needRespondBy));
      // formData.append('createdBy', this.convertToDate(this.editableObject.createdBy));
      formData.append('dateRequested', this.editableObject.dateRequested);
      formData.append('projectName', this.editableObject.projectName || this.editableObject.mailSubject);
      formData.append('items', (JSON.stringify(this.row)));

      if (type == 'reSubmit') {
        formData.append('isSentForAppr', (false) + '');
        formData.append('isCompleted', false + '');
        formData.append('isApproved', (false) + '');
        formData.append('sentForApprovalOn', '');
        formData.append('completedOn', '');

      }
      else if (type == 'saveApprove') {
        formData.append('isSentForAppr', (this.editableObject.isSentForAppr) + '');
        formData.append('isCompleted', (false) + '');
        formData.append('isApproved', (false) + '');
        formData.append('sentForApprovalOn', this.editableObject.sentForApprovalOn || '');

      }


      // formData.append('items',JSON.stringify(this.row));
      // formData.append('itemNo',this.editableObject.itemNo);
      formData.append('notes', this.editableObject.notes);
      for (let i = 0; i < this.fileInput.files.length; i++) {
        formData.append('newAttachments', this.fileInput.files[i]);
      }
      this.itemService.addPriceInquiry(formData).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.isbtnShow = true
          this.isbtnHide = false
          this.btnhide = true
          this.isBtnSh = false
          this.submitted = false;
          this.displayMaximizable = false;
          this.itemLoading = false;
          this.editableObject = new PriceInquery();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
          if (this.currentTab == 2)
            this.getAllSentAproval()
          else if (this.currentTab == 3)
            this.getAllCompleted();
          else
            this.getAllpriceInqueries();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
          this.itemLoading = false;
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      });
      // }
    }
  }

  saveApproval() {
    this.submitted = true;
    if (this.editableObject.mailSubject?.trim() && (this.editableObject.needRespondBy)) {
      this.itemLoading = true;
      let formData = new FormData();
      formData.append('id', this.editableObject.id ? this.editableObject.id : this.objj);
      formData.append('mailSubject', this.editableObject.mailSubject);
      formData.append('customer', this.editableObject.customer);
      formData.append('isSentForAppr', (true) + '');
      formData.append('isCompleted', (false) + '');
      formData.append('isApproved', (false) + '');
      formData.append('needRespondBy', this.convertToDate(this.editableObject.needRespondBy));
      // formData.append('createdBy', this.convertToDate(this.editableObject.createdBy));
      formData.append('dateRequested', this.editableObject.dateRequested);
      formData.append('projectName', this.editableObject.projectName);
      formData.append('sentForApprovalOn', this.editableObject.sentForApprovalOn || '');

      // let itemObj = JSON.stringify(this.row)
      // formData.append('items',itemObj);
      formData.append('items', JSON.stringify(this.row));
      // formData.append('itemNo',this.editableObject.itemNo);
      formData.append('notes', this.editableObject.notes);
      for (let i = 0; i < this.fileInput.files.length; i++) {
        formData.append('newAttachments', this.fileInput.files[i]);
      }
      this.itemService.addPriceInquiry(formData).subscribe((response: Response) => {
        if (response.statusCode == 200 && response.data == 1) {
          this.isbtnShow = false
          this.isbtnHide = true
          this.btnhide = false
          this.isBtnSh = true
          this.submitted = false;
          this.displayMaximizable = false;
          this.itemLoading = false;
          this.editableObject = new PriceInquery();
          this.messageService.add({ severity: 'success', summary: 'Send For Approval', detail: response.message, life: 3000 });
          if (this.currentTab == 2)
            this.getAllSentAproval()
          else if (this.currentTab == 3)
            this.getAllCompleted();
          else
            this.getAllpriceInqueries();
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
  }
  saveCompleteApproval(isApp) {
    this.submitted = true;
    if (this.editableObject.mailSubject?.trim() && (this.editableObject.needRespondBy)) {
      this.itemLoading = true;
      let formData = new FormData();
      formData.append('id', this.editableObject.id ? this.editableObject.id : this.objj);
      formData.append('mailSubject', this.editableObject.mailSubject);
      formData.append('customer', this.editableObject.customer);
      formData.append('isSentForAppr', (this.editableObject.isSentForAppr) + '');
      formData.append('isCompleted', (true) + '');
      formData.append('needRespondBy', this.convertToDate(this.editableObject.needRespondBy));
      formData.append('dateRequested', this.editableObject.dateRequested);
      formData.append('projectName', this.editableObject.projectName);
      formData.append('sentForApprovalOn', this.editableObject.sentForApprovalOn);
      formData.append('isApproved', (isApp) + '');

      // let itemObj = JSON.stringify(this.row)
      // formData.append('items',itemObj);
      formData.append('items', JSON.stringify(this.row));
      // formData.append('itemNo',this.editableObject.itemNo);
      formData.append('notes', this.editableObject.notes);
      for (let i = 0; i < this.fileInput.files.length; i++) {
        formData.append('newAttachments', this.fileInput.files[i]);
      }
      this.itemService.addPriceInquiry(formData).subscribe((response: Response) => {
        if (response.statusCode == 200 && response.data == 1) {
          this.isbtnShow = false
          this.isbtnHide = true
          this.btnhide = false
          this.isBtnSh = false

          this.submitted = false;

          this.displayMaximizable = false;
          this.itemLoading = false;
          this.editableObject = new PriceInquery();
          this.messageService.add({ severity: 'success', summary: 'Approved', detail: response.message, life: 3000 });
          this.getAllSentAproval();
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
  }
  getExceltab1(type) {

    if (this.priceInqueries.length > 0) {
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      this.service.exportOpenPIFiles(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          if (type == 'xlsx') {
            a.download = `OpenPriceInquiry-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `OpenPriceInquiry-${this.currentDate}.csv`;
          } else a.download = `OpenPriceInquiry-${this.currentDate}.pdf`;

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

  getExceltab2(type) {

    if (this.priceInqueries.length > 0) {
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.page.pageNumber,
      }
      this.service.exportapprovalFiles(body, type).subscribe(
        (res) => {
          this.loadExlFile = false;
          this.loadCsvFile = false;
          this.loadPdfFile = false;
          const blob2 = new Blob([res], { type: 'application/octet-stream' });
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob2);
          if (type == 'xlsx') {
            a.download = `SendApprovalPriceInquiry-${this.currentDate}.xlsx`;
          } else if (type == 'csv') {
            a.download = `SendApprovalPriceInquiry-${this.currentDate}.csv`;
          } else a.download = `SendApprovalPriceInquiry-${this.currentDate}.pdf`;

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

  getExceltab3(type) {

    if (this.priceInqueries.length > 0) {
      if (type == 'xlsx') {
        this.loadExlFile = true;
      } else if (type == 'csv') {
        this.loadCsvFile = true;
      } else {
        this.loadPdfFile = true;
      }

      let body = {
        filterOptr: this.selectFilter,
        filter: '',
        sortDir: '',
        sortCol: '',
        gridFilters: {},
        size: this.totalRecords,
        page: this.paging.pageNumber,
      }
      let exportUrl: boolean = false;
      if (this.currentTab == 3) {
        exportUrl = true
      }
      let dType: boolean = false
      if (this.currentTab == 3 && this.currentsubTab == 1) {
        dType = true
      }
      this.service.exportcompleteFiles(body, type, exportUrl, dType).subscribe((res) => {
        this.loadExlFile = false;
        this.loadCsvFile = false;
        this.loadPdfFile = false;
        const blob3 = new Blob([res], { type: 'application/octet-stream' });
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob3);
        if (type == 'xlsx') {
          a.download = `CompletePriceInquiry-${this.currentDate}.xlsx`;
        } else if (type == 'csv') {
          a.download = `CompletePriceInquiry-${this.currentDate}.csv`;
        } else a.download = `CompletePriceInquiry-${this.currentDate}.pdf`;

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

  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-money',
      url: "/items-list/price-inquiry",
      shortcutName: "Price Inquiry",
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
    this.dtMmgmtService.getSortcutName('Price Inquiry').subscribe((res) => {
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
    //this.getAllpriceInqueries();
  }
  hidewarningDialog() {
    this.openExtraCol = false
  }

  deleteImg(obj: any, from = null) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + obj.attachmentName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (from == 'projectAttacment') {
          this.projectAttachments = this.projectAttachments.filter(img => img.attachmentName != obj.attachmentName);
        } else {
          this.editableObject.attachments = this.editableObject.attachments.filter(img => img.id != obj.id);
        }
        this.itemService.deleteAttachmentPriceInq(obj.id).subscribe((res: Response) => {
          if (res.statusCode == 200) {
            if (res.data) {
              //this.ab = this.row.pop();
              if (this.currentTab == 2) {
                this.getAllSentAproval();
              }

              else if (this.currentTab == 3) {
                this.getAllCompleted();
              }
              else {
                this.getAllpriceInqueries();
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
        }
        )
      },
    });
  }

  hideEditProject() {
    this.openAddEditProject = false;
    this.editableProjectItem = null;
    this.submitted = false;
  }


  deleteRow1(rowData) {
    if (this.row.length == 1) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Atleast one row is required', life: 3000, });
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ab = this.row.pop();

      }
    })

  }


  getProjectItemsById(cat) {
    this.loading = true;
    this.editableObject = cat;
    this.itemService.getPiProjectPopUpInfoByPiId(cat.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.projectItems = res.data.projectData;

        this.projectAttachments = res.data.attachments;
        this.openAddEditProject = false;
        this.openProject = true;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    }, error => {
      this.loading = false;
    })
  }

  clearNew() {
    this.mailSubjectSearch = '';
    this.customerSearch = '';
    this.needRespondByDt = null;
    if (this.currentTab == 1) {
      this.getAllpriceInqueries();
    } else if (this.currentTab == 2) {
      this.getAllSentAproval();
    } else {
      this.getAllCompleted();
    }
  }

  loadAllpriceInqueries() {
    if (!this.mailSubjectSearch && !this.customerSearch && !this.needRespondByDt) {
      this.toastr.errorToastr('No searchable input found!')
      return
    }
    else if (this.currentTab == 1) {
      this.getAllpriceInqueries();
    } else if (this.currentTab == 2) {
      this.getAllSentAproval();
    } else {
      this.getAllCompleted();
    }
  }

  resetPosition() {
    if (this.pdialog) {
      this.pdialog.maximize();
      this.pdialog.resetPosition();
    }
  }
  disableClose(val?) {
    this.allowClose = true;
  }

  setNormal(event) {
    setTimeout(() => {
      event.target.value = event.target.value ? parseFloat(event.target.value) : event.target.value
    }, 10)
  }

  setDecimal(event) {
    setTimeout(() => {
      event.target.value = event.target.value ? parseFloat(event.target.value).toFixed(2) : event.target.value
    }, 10)
  }

  get isNonEditable() {
    return this.currentTab == 3 || (!this.actions.canAdd && !this.actions.canEdit)
  }

  closeAndSave(event?) {
   if(this.isNonEditable){
      this.displayMaximizable = false
     return;
   }

    if (!this.allowClose || this.currentsubTab) {
      this.displayMaximizable = false;
      this.allowClose = false;
      this.objj = '';
      return
    }
    this.confirmationService.confirm({
      message: 'Do you want to save the information?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveProduct('saveApprove');
        this.displayMaximizable = false;
        this.allowClose = false;
        this.displayMaximizable = false;
        this.allowClose = false;
        this.objj = '';

      },
      reject: () => {
        // this.myGroup.reset();
        this.displayMaximizable = false;
        this.allowClose = false;
        this.objj = '';


      },
    });
  }
  newSearch(event?: LazyLoadEvent) {
    let searchFields: any[] = [];

    let dateFields: any[] = [];
    if (this.mailSubjectSearch?.trim()) {
      searchFields.push({ fieldName: 'email', fieldVal: this.mailSubjectSearch });
    }
    if (this.customerSearch?.trim()) {
      searchFields.push({ fieldName: 'customer', fieldVal: this.customerSearch });
    }
    if (this.needRespondByDt?.trim()) {
      searchFields.push({ fieldName: 'responsedt', fieldVal: this.needRespondByDt });
    }

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
      size: this.paging.size,
      page: this.paging.pageNumber,
      filter: event && event.globalFilter ? event.globalFilter : '',
      sortDir: event && event.sortOrder == 1 ? 'asc' : 'desc',
      sortCol: event && event.sortField,
      gridFilters: event && event.filters ? event.filters : {},
      searchFields: searchFields,
      dateFields: dateFields,
    };

    this.loading = true;
  }

  editPop() {

    this.isEdit = !this.isEdit;
    // this.isedit = true
    // this.allowClose = true;

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
    switch (this.currentTab) {
      case 1:
        this.getAllCompleted()
        break;
      case 2:
        this.getAllSentAproval() 
      break;
      case 3:
        this.getAllpriceInqueries()
      break;
  }
}
   pageSizeChanged(e){
    this.paging.pageSize = e;
}
}

