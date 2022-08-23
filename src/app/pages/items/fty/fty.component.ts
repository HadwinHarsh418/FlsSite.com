import { Component, Input, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';
import { FTY } from 'src/app/models/fty';
import { Page } from 'src/app/models/page';
import { Permission } from 'src/app/models/permissions';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-fty',
  templateUrl: './fty.component.html',
  styleUrls: ['./fty.component.css'],
})

export class FtyComponent implements OnInit {
  user: Users;
  ftys: FTY[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  editableObject: FTY;
  productDialog: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  page: Page = new Page();
  MAX_SIZE: number = 20;

  FtyCode: string = '';
  FtyGroup: string = '';
  searchStatus:any;
  ftyStatuses:any[]=[
    {name:'--SELECT STATUS--', code:null},
    {name:'ACTIVE', code:true},
    {name: 'INACTIVE', code:false}
  ]
  ftySearchStatuses:any[]=[
    {name:'ALL', code:null},
    {name:'ACTIVE', code:true},
    {name: 'INACTIVE', code:false}
  ]
  selectedFtyStatus:any;

  selectedPermission = [];
  permissions: Permission[];

  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canUpload: false
  }
  cols: any[] = [];
  totalRecords: number = 0;
  loadingShortCut: boolean;
  stCode: number = 0;

  uploadStatus: {
    totalRows: 0,
    rowsInserted: 0,
    rowsNotInserted: 0
  }
  openExtraCol: boolean;
  hideUploadSec: Boolean;
  debounceApi = new Subject<any>();
  _selectedColumns: any[] = [];
  selectedCols: any = [];
  actionBtn: boolean;
  hide: boolean = false;
  colLength: number = 0;

  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;

  constructor(
    private toastr: ToastrManager,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private userService: UserService,
    private itemService: ItemsService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();
    this.setPage();
  }

  ngOnInit(): void {
    this.page.pageNumber = 0;
    this.page.size = this.MAX_SIZE;
    // this.getAllFTYs();

    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(23),
      canEdit: this.permissionService.getPermissionStatus(25),
      canDelete: this.permissionService.getPermissionStatus(24),
      canUpload: this.permissionService.getPermissionStatus(40)
    }

    this.debounceApi.pipe(
      debounceTime(500)
    ).subscribe(data => {
      this.saveColumns(data);
    });
  }


  getAllFTYs(event?: LazyLoadEvent) {
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
    let searchFields: any[] = [];

    if (this.FtyCode?.trim()) {
      searchFields.push({ fieldName: 'Fty', fieldVal: this.FtyCode });
    }
    if (this.FtyGroup?.trim()) {
      searchFields.push({ fieldName: 'FtyGroup', fieldVal: this.FtyGroup });
    }
    if(this.searchStatus && this.searchStatus.code != null) {
      searchFields.push({ fieldName: 'FtyStatus', fieldVal: this.searchStatus.code });
    }
    if (event) {
      if (Object.keys(event.filters).length != 0 && event.filters.constructor === Object) {
        ft = event.filters
      }
    }
    
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: (event && event.globalFilter) ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      userId: this.user.userId,
      searchFields: searchFields,

    }
    this.itemService.getAllFty(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        if (!this._selectedColumns.length) {
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
            this.selectedColumns = this.cols.filter(items => this.selectedCols.includes(items.field));
            const newColumn = this.selectedColumns.filter(item => item.field != 'Action')
            this.selectedColumns = newColumn;
            this.colLength = this.cols.length;

          }

        }
        this.ftys = res.data;
        this.totalRecords = res.totalElements;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }
  clearNew() {
    this.FtyCode = '';
    this.FtyGroup= '';
    this.searchStatus= [];
    this.getAllFTYs();
  }
  columnsHeader() {
    let columns = [
      { isDisplay: false, field: 'ftyGroup', header: 'Fty Group' },
      { isDisplay: false, field: 'fty', header: 'FTY' },
      { isDisplay: false, field: 'vendId', header: 'VENDID' },
      { isDisplay: false, field: 'ftyDesc', header: 'Fty Name' },
      { isDisplay: false, field: 'lclSurcharge', header: 'LCL Surcharge' },
      { isDisplay: false, field: 'nyTerms', header: 'NY Terms' },
      { isDisplay: false, field: 'caTerms', header: 'CA Terms' },
      { isDisplay: false, field: 'termNotes', header: 'Term Notes' },
      { isDisplay: false, field: 'portOfLoading', header: 'Port of Loading' },
      { isDisplay: false, field: 'telexReleaseTerm', header: 'Telex Release Term' },
      { isDisplay: false, field: 'ftyStatus', header: 'Fty Status' },
      { isDisplay: false, field: 'Action', header: 'Action' }
    ]
    return columns;
  }
  updateActionButtons() {
    let actionAvaile = this.selectedColumns.filter(item => item.field == 'Action');
    if (actionAvaile.length) {
      const newColumn = this.selectedColumns.filter(item => item.field != 'Action')
      this.selectedColumns = newColumn;
    }
    else {
      this.selectedColumns.push({ currency: false, field: "Action", header: "Action", selectedCName: "Action" })
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  deleteProduct(fty: FTY) {
    const nameCapitalized = fty.fty.charAt(0).toUpperCase() + fty.fty.slice(1);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.itemService.deleteFty(fty.id).subscribe((res) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.getAllFTYs();
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
    this.editableObject = new FTY();
    this.selectedFtyStatus = this.ftyStatuses[0];
    this.selectedPermission = [];
    this.submitted = false;
    this.productDialog = true;
  }
  editProduct(fty: FTY) {
    this.getFtyById(fty);
  }

  getFtyById(fty) {
    this.loading = true;
    this.itemService.getFtyById(fty.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.editableObject = res.data;

        if(this.editableObject.ftyStatus == false) {
          this.selectedFtyStatus = this.ftyStatuses[2]
        } else if(this.editableObject.ftyStatus == true) {
          this.selectedFtyStatus = this.ftyStatuses[1]
        } else {
          this.selectedFtyStatus = this.ftyStatuses[0]
        }

        this.productDialog = true;
        this.loading = false;
      }
      else {
        this.toastr.errorToastr('Oops something went wrong')
      }
    })


  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.itemLoading = false;
  }

  saveProduct() {
    this.submitted = true;
    if (this.editableObject.vendId.trim() && this.editableObject.fty.trim()) {
      this.itemLoading = true;
      let data = {
        id: this.editableObject.id ? this.editableObject.id : 0,
        vendId: this.editableObject.vendId,
        fty: this.editableObject.fty,
        ftyDesc: this.editableObject.ftyDesc,
        ftyGroup: this.editableObject.ftyGroup,
        // searchStatus: this.searchStatus,
        portOfLoading: this.editableObject.portOfLoading,
        telexReleaseTerm: this.editableObject.telexReleaseTerm,
        lclSurcharge: this.editableObject.lclSurcharge,
        nyTerms: this.editableObject.nyTerms || null,
        caTerms: this.editableObject.caTerms || null,
        termNotes: this.editableObject.termNotes,
        ftyStatus: this.selectedFtyStatus?.code
      }
      if (this.editableObject.id) {
        // this.userService.updateRole(data, this.editableObject.id).subscribe((response: Response) => {
        this.itemService.updateFTY(data).subscribe((response: Response) => {
          if (response.statusCode == 200 && response.data == 1) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new FTY();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllFTYs();
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
        this.itemService.addFTY(data).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new FTY();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllFTYs();
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

  saveReorderedColumns(event: any) {
    this.save(event.columns);
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
      pageName: "Fty",
      columns: valSelected
    }
    this.debounceApi.next(dt);

  }

  onChange(event: any) {
    this.save(event.value);

  }

  saveColumns(dt) {
    this.dtMmgmtService.saveColumns(dt).subscribe((res) => {
      if (res.statusCode == 200) {
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'there should be atleast one column name', life: 3000 });
      }
    })
  }

  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-settings',
      url: "items-list/fty",
      shortcutName: "FTY",
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
    this.dtMmgmtService.getSortcutName('FTY').subscribe((res) => {
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
    this.getAllFTYs();
  }
  hidewarningDialog() {
    this.openExtraCol = false
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
    this.getAllFTYs();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.getAllFTYs();
}

}
