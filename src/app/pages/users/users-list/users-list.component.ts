import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Page } from 'src/app/models/page';
import { Response } from 'src/app/models/response';
import { Roles } from 'src/app/models/roles';
import { Users } from 'src/app/models/users';
import { DataManagementService } from 'src/app/services/data-management.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: Users[]
  user: Users;
  customers: Users[];
  selectedCustomers: Users[];
  representatives = [];
  loading: boolean = true;
  roles: Roles[];
  required:boolean=false;
  activityValues: number[] = [0, 100];
  editableObject: Users;
  productDialog: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  selectedRoles = [];
  statuses: any[];
  name:string;
  actions = {
    canEdit: true,
    canDelete: false,
    canAssgn: false,
    
  }

  cities1: any[] = [];
  deleteText: string;
  deleteDialogue: boolean;
  items: Users;
  loadingShortCut: boolean;
  stCode: number = 0;
  allPermission: any = [];
  actionBtn: boolean;


  hide: boolean = false;
  cols: any[] = [];
  cols1: any[] = [];
  page: Page = new Page();
  MAX_SIZE: number = 20;
  totalRecords: number = 0;
  colLength: number = 0;
  colLength1: number = 0;
  addDepartment: boolean;
  deptName: string;
  deptList: any;
  hideTable: boolean = false;
  actioName: any = "Add Department";
  canView:boolean =false;
  canVew:boolean=false;
  depId: any;
  disabled:boolean=false;
  requiredForm: any;
  fb: any;
  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user = this.userService.tokenKey.user;
   
    this.getShortCutStatus();
    this.setPage();
  }

  ngOnInit(): void {


    this.actions = {
      canEdit: this.permissionService.getPermissionStatus(14),
      canDelete: this.permissionService.getPermissionStatus(16),
      canAssgn: this.permissionService.getPermissionStatus(12),
      
    }
    this.canVew= this.permissionService.getPermissionStatus(69);
    this.canView = this.permissionService.getPermissionStatus(68);
    this.statuses = [
      { label: 'Pending', value: 1 },
      { label: 'Approved', value: 2 },
      { label: 'Locked', value: 3 },
      { label: 'Terminated', value: 4 },
    ]
    this.getListOfDept();
    // let prm = JSON.parse(localStorage.getItem('rolPrm'));
    // if (prm && prm.length)
    //   this.allPermission = prm;
  }
 

  getAllUsers(event?: LazyLoadEvent) {
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
      userId: this.user.userId

    }
    this.userService.getAllUser(body).subscribe((res) => {
      if (res.statusCode == 200) {
        
        this.paging.pageNumber = res.pageNumber;
            this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        res.data.map(cs => {
          if (cs.roles.length)
            cs.isAdmin = cs.roles.findIndex(cp => cp.roleName == 'SuperAdmin') > -1
        })
        if (!this.cols.length) {
          this.cols = this.columnsHeader();
          this.colLength = this.cols.length;
        }
        this.customers = res.data;
        this.totalRecords = res.totalElements;
        this.getAllRoles();
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }


  deptHeader() {
    this.cols1 = [];
    let columns1 = [
      { field: 'department', header: 'Department' },
      // { field: 'Action', header: 'Action' },
    ]
    return columns1;
  }
  columnsHeader() {
    this.cols = [];
    let columns = [
      { hidden: false, field: 'firstName', header: 'First Name' },
      { hidden: false, field: 'lastName', header: 'Last Name' },
      { hidden: false, field: 'email', header: 'Email' },
      { hidden: false, field: 'phone', header: 'Phone' },
      { hidden: false, field: 'department', header: 'Department' },
      { hidden: false, field: 'loc', header: 'Loc' },
      { hidden: false, field: 'company', header: 'Company' },
      { hidden: false, field: 'comment', header: 'Comment' },
      { hidden: false, field: 'status', header: 'Status' },
      { hidden: false, field: 'isTwoFactAuth', header: '2FA' },
      { hidden: false, field: 'dateRegistered', header: 'Reg. Date', format: `MM/dd/yyyy`, data: true },
      { hidden: false, field: 'Action', header: 'Action' },
    
      { hidden: true, field: 'isAdmin', header: 'isAdmin' },
    ]
    return columns;
  }

  updateActionButtons() {
    this.cols = this.columnsHeader()
  }
  getAllRoles() {
    this.loading = true;
    this.userService.getAllRoles().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.roles = res.data;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }
    })

  }

  deleteProduct(user: Users) {
    let st = (user.status) ? 'Enable' : 'Disable';
    const nameCapitalized = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.items = user;
        this.deleteDialogue = true
      }
    });
  }

  hideDeleteDialog() {
    this.deleteDialogue = false;
    this.submitted = false;
    this.itemLoading = false;
    this.deleteText = '';
  }

  finalDelete() {
    this.submitted = true;
    if (this.deleteText == 'YES') {
      this.itemLoading = true;
      this.userService.deleteUser(this.items.userId).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.submitted = false;
          this.deleteDialogue = false;
          this.itemLoading = false;
          this.deleteText = '';
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
          this.getAllUsers();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
          this.itemLoading = false;
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please enter YES ', life: 3000 });

    }
  }

  editProduct(user) {
    this.getUserById(user)
  }

  getUserById(user: Users) {
    this.loading = true;
    this.userService.getUserById(user.userId).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.editableObject = { ...res.data }
        this.allPermission = res.data['permissions']
        if (!this.editableObject.roles)
          this.editableObject.roles = [];
        let yFilter = this.editableObject.roles.map(itemY => { return itemY.roleName; });
        let newC = this.editableObject.roles.map(itemY => { return (itemY.roleId).toString(); });
        let obj = this.roles.filter(item => yFilter.includes(item.roleName));
        // let filteredArray = this.roles.filter(function (array_el) {
        //   return this.editableObject.roles.filter(function (anotherOne_el) {
        //     return anotherOne_el.roleId == array_el.id;
        //   }).length == 0
        // });
        let edDOc = this.deptList.filter(fl => fl.department == this.editableObject.department)
        this.editableObject.department = edDOc[0];
        this.selectedRoles = obj;
        // this.selectedRoles = newC;
        this.productDialog = true;
        this.loading = false;
      }
    })
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.itemLoading = false;

  }
  edit() {
    this.submitted = true;
    if (this.editableObject.firstName.trim() && this.editableObject.lastName.trim()) {
      this.itemLoading = true;
      if (this.editableObject.userId) {
        if (this.selectedRoles) {
          let role = [];
          let obj = this.roles.filter(item => this.selectedRoles.map(ct => ct = ct.id).includes(item.id));
          // let obj = this.roles.filter(item => this.selectedRoles.map(ct => ct = parseInt(ct)).includes(item.id));
          obj.forEach(rl => {
            role.push({ userId: this.editableObject.userId, roleId: rl.id })
          })
          this.editableObject.roles = role;
        }
        
        let newObj = JSON.parse(JSON.stringify(this.editableObject));
       newObj.department = newObj.department ? newObj.department['id'] : ''
        this.userService.updateUser(newObj, this.editableObject.userId).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new Users();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User updated', life: 3000 });
            this.getAllUsers();
          }
          else if (response.statusCode == 400) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
          }
        }, error => {
        });
      }
      else {

        // this.itemService.addItem(this.editableObject).subscribe((response: any) => {
        //   if (response) {
        //     this.submitted = false;
        //     this.productDialog = false;
        //     this.itemLoading = false;
        //     this.editableObject = new Items();
        //     this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Created', life: 3000 });
        //     this.loadCustomers();
        //   } else {
        //     this.toastr.errorToastr('Oops something went wrong');
        //   }
        // }, error => {
        // });
      }
    }
  }

  show(user: Users) {
    let index = this.customers.findIndex(x => x.userId == user.userId)
    let newVal = {
      firstName: user.firstName, lastName: user.lastName, email: user.email, company: user.comment, comment: user.comment, status: user.status, roles: user.roles
    }
    this.customers.splice(index, 0, newVal)
  }



  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-user',
      url: "/users",
      shortcutName: "Users",
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
    this.dtMmgmtService.getSortcutName('Users').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }


  activate2Fa(user: Users) {
    const body = {
      email: user.email,
      isEnable: user.isTwoFactAuth
    }
    this.userService.enable2Fa(body).subscribe((res: Response) => {
      if (res.statusCode == 200 && res.data == 1) {
        this.getAllUsers();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  openDept() {
    this.addDepartment = true;

  }

  getListOfDept() {
    this.userService.getDeptList().subscribe((res) => {

      if (res.statusCode == 200) {
        if (res.data.length == 1) {
          this.hideTable = false;
        }
        else {
          this.hideTable = true;
          this.deptList = res.data;
          if (!this.cols1.length) {
            this.cols1 = this.deptHeader();
            this.colLength1 = this.cols.length;
          }
        }

      }


    });
  }
  editDept(row) {
    this.actioName = "Edit Department";
    this.deptName = row.department;
    this.depId = row.id;
  }

  deleteDept(row) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + row.department + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteDept(row.id).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            if (response.data == 0) {
              this.messageService.add({ severity: 'error', summary: 'Error Message', detail: "Department not deleted, it might be in use", life: 3000 });

            }
            else {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            }

            this.getListOfDept();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
        });
      }
    });

  }
 
  addDept() {
   if (this.actioName == 'Add Department'  ) {
      this.userService.addDept(this.deptName).subscribe((response: Response) => {
        if (response.statusCode == 200) {
         
         this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
         this.getListOfDept();
        } 
        else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
          this.itemLoading = false;
          
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      });
    }
   
    if (this.actioName == "Edit Department") {
      this.userService.editDept(this.deptName, this.depId).subscribe((response: Response) => {
        if (response.statusCode == 200) {
         // this.deptName = "";
         // this.actioName = "Add Department";
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
          //this.getListOfDept();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
          this.itemLoading = false;
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      });
    }
  }

  checkValue() {
    console.warn(this.editableObject.department)
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
    this.getAllUsers();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.getAllUsers(null);
}
}
