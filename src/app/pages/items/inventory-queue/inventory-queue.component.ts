import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { InventoryQueue, InventoryQueueArr } from 'src/app/models/inventoryQueue';
import { Page } from 'src/app/models/page';
import { Response } from 'src/app/models/response';
import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-inventory-queue',
  templateUrl: './inventory-queue.component.html',
  styleUrls: ['./inventory-queue.component.css']
})
export class InventoryQueueComponent implements OnInit {

  inventoryQueues: InventoryQueue[];
  itemQueue: InventoryQueueArr[];
  editableObjectQueue: InventoryQueueArr;
  loading: boolean = false;
  editableObject: InventoryQueue[];
  productDialog: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,

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
  page: Page = new Page();
  hide: boolean = false;
  cols: any[] = [];
  cols1: any[] = [];
  filterByStatus: any;
  colLength: number = 0;
  totalRecords: number = 0;
  projectAttachments: any[] = [];
  projectItems: InventoryQueueArr[];
  editableProjectItem: InventoryQueueArr;
  openProject: boolean;
  openAddEditProject: boolean;
  statusOption = [{ label: 'One Time', value: 'One Time' }, { label: 'Continuous', value: 'Continuous' }];
  locationOptions = [{ label: 'East Cost', value: 'East Cost' }, { label: 'West Cost', value: 'West Cost' }, { label: 'Central', value: 'Central' }];
  currentTab = 1;
  user: any;
  
  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;

  constructor(
    private messageService: MessageService,
    private userService:UserService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private itemService: ItemsService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user=this.userService.tokenKey.user;
    this.getShortCutStatus();
    this.setPage();
  }

  ngOnInit(): void {
    this.getAllInventories();
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(62),
      canEdit: this.permissionService.getPermissionStatus(61),
      canDelete: this.permissionService.getPermissionStatus(63),


    }
  }

  changeTab(tab) {
    if(tab !== this.currentTab) {
      this.currentTab = tab;
      this.clearAndGetNew();
    }
  }

  clearAndGetNew(){
    this.page = new Page();
    this.inventoryQueues = [];
    this.totalRecords = 0;
    this.getAllInventories();
  }

  getAllInventories(event?: LazyLoadEvent) {
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
      Status: this.filterByStatus ? this.filterByStatus.value : 1
    }
    this.itemService.getAllInventories(body, this.currentTab).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        this.cols = this.columnsHeader();
        this.cols1 = this.columnsHeaders();
        this.colLength = this.cols.length;

        this.inventoryQueues = res.data;
        this.totalRecords = res.totalElements;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })




  }
  columnsHeader() {
    this.cols = [];
    let columns = [
      { hidden: false, field: 'customer', header: 'Customer' },
      { hidden: false, field: 'custLoc', header: 'Customer Location' },
      { hidden: false, field: 'createdOn', header: 'Date', type: 'date', format: `MM/dd/yyyy`, data: true },
      { hidden: false, field: 'endUser', header: 'User' },
      { hidden: !this.actionBtn, field: 'Action', header: 'Action' },
    ]
    return columns;
  }
  columnsHeaders() {
    this.cols1 = [];
    let columns1 = [
      { hidden: false, field: 'itemNo', header: 'ITEM NO' },
      { hidden: false, field: 'qty', header: 'QTY' },
      { hidden: false, field: 'comments', header: 'SALES COMMENTS' },
      { hidden: false, field: 'feedback', header: 'FEEDBACK' },

    ]
    return columns1;
  }


  updateActionButtons() {
    this.cols = this.columnsHeader()
  }

  deleteProduct(inventories: InventoryQueue) {
    const nameCapitalized = inventories.customer;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.itemService.deleteInventoryQueue(inventories.id).subscribe((res: Response) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.getAllInventories();
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
    this.editableObject = [new InventoryQueue()]
    this.editableObject.forEach(item => {
      item.items = [new InventoryQueueArr()];
    })
    this.submitted = false;
    this.productDialog = true;
  }

  addnewCutomer() {
    this.editableObject.push(new InventoryQueue())
  }
  deleteCustomer(editObj: InventoryQueue) {

    if (editObj.id != undefined) {
      const nameCapitalized = editObj.customer
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loading = true;
          this.itemService.deleteInventoryQueue(editObj.id).subscribe((res: Response) => {
            if (res.statusCode == 200 && res.data == 1) {
              const index = this.editableObject.indexOf(editObj);
              if (index > -1) {
                this.editableObject.splice(index, 1);
              }
              this.getAllInventories();
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
    else {
      const index = this.editableObject.indexOf(editObj);
      if (index > -1) {
        this.editableObject.splice(index, 1);
      }
    }


  }

  addNewRow(item: InventoryQueue) {
    if(item.items && item.items.length > 0) {
      let id = item.items[item.items.length-1];
      if(!id.itemNo && !id.qty && !id.comments) {
        return;
      }
    }
    item.items.push(new InventoryQueueArr());
  }

  deleteRow(editObj: InventoryQueue, obj: InventoryQueueArr) {
    if (obj.id != undefined && obj.invQueueId != "0") {
      // const nameCapitalized = obj.itemNo;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loading = true;
          this.itemService.deleteInvQueueItem(obj.id).subscribe((res: Response) => {
            if (res.statusCode == 200 && res.data == 1) {
              const index = editObj.items.indexOf(obj);
              if (index > -1) {
                editObj.items.splice(index, 1);
              }
              this.getAllInventories();
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
    else {
      const index = editObj.items.indexOf(obj);
      if (index > -1) {
        editObj.items.splice(index, 1);
      }
    }
  }

  editProduct(inventories: InventoryQueue) {
    this.getInventoryById(inventories);
  }

  getInventoryById(inventories) {
    this.loading = true;
    this.itemService.getInventoryQueuesById(inventories.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.editableObject = res.data;
        this.itemQueue = res.data.items;
        this.productDialog = true;
        this.editableObject.map((eitem, i) => {
          let selecLoc = this.locationOptions.filter(item => item.value == eitem.oneTimeCont)
          eitem.selcustLoc = (selecLoc && selecLoc.length) ? selecLoc[0] : this.locationOptions[0];

          let seleOne = this.statusOption.filter(item => item.value == eitem.custLoc)
          eitem.seloneTimeCont = (seleOne && seleOne.length) ? seleOne[0] : this.statusOption[0];
        })
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })


  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.itemLoading = false;

  }

  isEditableEmpt() {
    this.editableObject.forEach(item => {
      if (!item.customer.trim()) {
        return false;
      }
    })
    return true;
  }
  saveProduct() {
    this.submitted = true;
    this.editableObject.map(selitem => {
      selitem.oneTimeCont = selitem.seloneTimeCont ? selitem.seloneTimeCont.value : selitem.oneTimeCont;
      selitem.custLoc = selitem.selcustLoc ? selitem.selcustLoc.value : selitem.custLoc;
      return selitem;
    });
    for (let i = 0; i < this.editableObject.length; i++) {
      if (!this.editableObject[i].custLoc) {
        return
      }
    }
    if (this.editableObject[0].customer.trim()) {
      if (this.isEditableEmpt()) {
        this.itemLoading = true;
        let data: any[] = [];
        this.editableObject.forEach(
          item => {
            data.push(
              {
                id: item.id ? item.id : 0,
                customer: item.customer,
                oneTimeCont: item.seloneTimeCont ? item.seloneTimeCont.value : item.oneTimeCont,
                custLoc: item.selcustLoc ? item.selcustLoc.value : item.custLoc,
                endUser: item.endUser,
                items: item.items,
              }
            )
          }
        );
        if (this.editableObject[0].id) {

          this.itemService.updateInventoryQueue(data, this.editableObject[0].id).subscribe((response: Response) => {
            if (response.statusCode == 200 && response.data == 1) {
              this.submitted = false;
              this.productDialog = false;
              this.itemLoading = false;
              this.editableObject = [];
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
              this.getAllInventories();
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
          this.itemService.addInventoryQueue(data).subscribe((response: Response) => {
            if (response.statusCode == 200) {
              this.submitted = false;
              this.productDialog = false;
              this.itemLoading = false;
              this.editableObject = []
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
              this.getAllInventories();
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
  }



  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-server',
      url: "/items-list/inventory-queue",
      shortcutName: "InventoryQueue",
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
    this.dtMmgmtService.getSortcutName('InventoryQueue').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }


  viewProject(inventories: InventoryQueue) {
    this.getProjectItemsById(inventories);
  }
  getProjectItemsById(inventories) {
    this.loading = true;
    this.editableObject = inventories;
    this.itemService.getInventoryQueuesById(inventories.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.itemQueue = res.data;
        res.data.map(element => {
          this.projectItems = element.items;

        });
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

  displayitems(items: InventoryQueue) {
    items.display = !items.display;
  }
  
  handler(event) {
    this.uploadStatus = event
    if (this.uploadStatus)
      this.openExtraCol = true
    this.getAllInventories();
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
    this.getAllInventories();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.getAllInventories();
}

}
