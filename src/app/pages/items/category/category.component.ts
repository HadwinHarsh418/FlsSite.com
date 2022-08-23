import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from 'src/app/models/category';
import { FTY } from 'src/app/models/fty';
import { Response } from 'src/app/models/response';
import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: FTY[];
  // totalCat:FTY[];

  loading: boolean = true;
  editableObject: Category;
  productDialog: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canUpload: false
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
  hide: boolean = false;
  cols: any[] = [];
  user: any;
  //user: import("d:/angular project/finelineFrontend/src/app/models/users").Users;

  // totalNumber: any;
  // Limit = 25;
  // paging: any;
  // startFrom: any;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private itemService: ItemsService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();
    // this.setPage();
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(27),
      canEdit: this.permissionService.getPermissionStatus(29),
      canDelete: this.permissionService.getPermissionStatus(28),
      canUpload: this.permissionService.getPermissionStatus(41)

    }
  }


  getAllCategories() {
    this.loading = true;
    this.itemService.getAllCategories().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.cols = this.columnsHeader()
        this.categories = res.data;
        // this.paging.totalPages = Math.ceil(this.totalCat.length / this.paging.pageSize);
        // this.getPageData();
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })
  }

  // getPageData() {
  //   let start = (this.paging.pageNumber-1)*this.paging.pageSize;
  //   this.categories = this.totalCat.slice(start, start+this.paging.pageSize);
  // }
  columnsHeader() {
    this.cols = [];
    let columns = [
      { hidden: false, field: 'catId', header: 'Cat Id' },
      { hidden: false, field: 'category', header: 'Category' },
      { hidden: !this.actionBtn, field: 'Action', header: 'Action' },
    ]
    return columns;
  }

  updateActionButtons() {
    this.cols = this.columnsHeader()
  }

  deleteProduct(cat: Category) {
    const nameCapitalized = cat.category.charAt(0).toUpperCase() + cat.category.slice(1);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.itemService.deleteCategory(cat.id).subscribe((res: Response) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.getAllCategories();
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
    this.editableObject = new Category();
    this.submitted = false;
    this.productDialog = true;
  }
  editProduct(cat: Category) {
    this.getFtyById(cat);
  }



  getFtyById(cat) {
    this.loading = true;
    this.itemService.getCategoryById(cat.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.editableObject = res.data;
        this.productDialog = true;
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

  saveProduct() {
    this.submitted = true;
    if (this.editableObject.category.trim() && this.editableObject.catId.trim()) {
      this.itemLoading = true;
      let data = {
        id: this.editableObject.id ? this.editableObject.id : 0,
        category: this.editableObject.category,
        catId: this.editableObject.catId,
      }
      if (this.editableObject.id) {
        this.itemService.updateCategory(data).subscribe((response: Response) => {
          if (response.statusCode == 200 && response.data == 1) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new Category();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllCategories();
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
        this.itemService.addCategory(data).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new Category();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllCategories();
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




  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-pulse',
      url: "/items-list/category",
      shortcutName: "Category",
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
    this.dtMmgmtService.getSortcutName('Category').subscribe((res) => {
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
    this.getAllCategories();
  }
  hidewarningDialog() {
    this.openExtraCol = false
  }
  // setPage() {
  //   this.paging = {
  //     totalElements: 0,
  //     totalPages: 0,
  //     pageSize: 25,
  //     pageNumber: 1,
  //   }
  // }
  // pageChanged(e) {
  //   this.paging.pageNumber = e;
  //   this.getPageData();
  // }
  // pageSizeChanged(e) {
  //   this.paging.pageSize = e;
  //   this.paging.pageNumber = 1;
  //   this.getPageData();
  // }

}
