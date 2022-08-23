import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Permission } from 'src/app/models/permissions';
import { Response } from 'src/app/models/response';
import { Roles } from 'src/app/models/roles';
import { Users } from 'src/app/models/users';
import { DataManagementService } from 'src/app/services/data-management.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  user: Users;
  roles: Roles[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  editableObject: Roles;
  productDialog: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;

  selectedPermission = [];
  permissions: Permission[];

  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canAssgn: false
  }
  newPermissions = [];
  loadingShortCut: boolean;
  stCode: number = 0;
  hideDelBtn: Boolean;
  actionBtn: boolean = true;
  hide: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user = this.userService.tokenKey.user;
    this.getShortCutStatus();

  }

  ngOnInit(): void {
    this.getAllRoles();
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(8),
      canEdit: this.permissionService.getPermissionStatus(9),
      canDelete: this.permissionService.getPermissionStatus(11),
      canAssgn: this.permissionService.getPermissionStatus(21),

    }
  }
  popup() {
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Permissions addedd successfully', life: 3000 });

  }

  getAllPermissions() {
    this.userService.getAllPermission().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.permissions = res.data;
        this.mapNewPerm();
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }
    })
  }

  mapNewPerm() {
    this.newPermissions = [
      { pageName: "Items", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Items')) },
      // { pageName: "Data Import", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'DataImport')) },
      { pageName: "Fty", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Fty')) },
      // { pageName: "Data Management", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'DataManagement')) },
      // { pageName: "Setting", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Setting')) },
      { pageName: "Roles", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Roles')) },
      { pageName: "Users", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Users')) },
      { pageName: "Dashboard", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Dashboard')) },
      { pageName: "Category", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Category')) },
      { pageName: "CLP", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Clp')) },
      // { pageName: "Pivot", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'PivotReport')) },
      { pageName: "Daily CLP POS", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'ClpDailyItems')) },
      { pageName: "Logs", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Logs')) },
      { pageName: "Sales", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Sales')) },
      { pageName: "Fty Notes", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'FtyNotes')) },
      { pageName: "Access Logs", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'AccessLog')) },
      { pageName: "CLP Item Review", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'ClpItemReview')) },
      { pageName: "CLP Info", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'ClpInfo')) },
      { pageName: "Sales Permission", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'SalesPermissions')) },
      { pageName: "PDF Operations", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'PdfOps')) },
      {
        pageName: "Price Inquiry", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Price Inquiry')),
        // tabPerms: [
        //   { id: 80, name: 'Veiw All', value: false, havethis: this.permissions.filter(items => items.id === 80)?.length > 0 },
        // ]
      },
      { pageName: "PD Inquiry", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'PD Inquiry')) },
      { pageName: "Inventory Queue", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'Inventory Queue')) },
      { pageName: "Sales Detail", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'SalesDetail')) },
      { pageName: "Sales Permissions Grid", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'SalesPermissionsGrid')) },
      { pageName: "View Sales Orders", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'SalesOrders')) },
      { pageName: "Load file data for Sales Report", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'PivotReport')) },
      { pageName: "User Department CRUD", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'UserDepartment')) },
      { pageName: "User Loc", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'UserLoc')) },
      {
        pageName: "Chargeback Claims", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'ChargebackClaims')),
        tabPerms: [
          { id: 74, name: 'Pending', value: false, havethis: this.permissions.filter(items => items.id === 74)?.length > 0 },
          { id: 75, name: 'Submitted', value: false, havethis: this.permissions.filter(items => items.id === 75)?.length > 0 },
          { id: 76, name: 'Final', value: false, havethis: this.permissions.filter(items => items.id === 76)?.length > 0 },
          { id: 77, name: 'Approved', value: false, havethis: this.permissions.filter(items => items.id === 77)?.length > 0 },
          { id: 79, name: 'Archive', value: false, havethis: this.permissions.filter(items => items.id === 79)?.length > 0 }
        ]
      },
      { pageName: "Shipid tracker", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'ShipIdTracker')) },
      
      // { pageName: "Delete Chargeback Claims", alpm: this.mapPemissions(this.permissions.filter(items => items.parentPage === 'ChargebackClaims')) },
    ]
  }

  mapPemissions(arr) {
    let totalPermisison: any[] = [
      {
        id: 0, name: "View", value: false, isDisabled: false, havethis: false, allowedFor: [3, 6, 22, 5, 7, 10, 15, 20, 26, 30, 35, 36, 37, 42, 44, 47, 48, 51, 52, 55, 56, 60, 64, 65, 66, 67, 68, 69, 70,81]
      },
      { id: 0, name: "Add", value: false, isDisabled: true, havethis: false, allowedFor: [1, 23, 8, 13, 27, 31, 53, 57, 62, 71,83] },
      { id: 0, name: "Edit", value: false, isDisabled: true, havethis: false, allowedFor: [2, 25, 9, 14, 29, 33, 54, 58, 61, 72,82] },
      { id: 0, name: "View All", value: false, isDisabled: true, havethis: false, allowedFor: [80] },
      { id: 0, name: "Delete", value: false, isDisabled: true, havethis: false, allowedFor: [4, 24, 11, 16, 28, 32, 63, 73,84] },
      { id: 0, name: "ExportCsv", value: false, isDisabled: true, havethis: false, allowedFor: [17, 46, 50] },
      { id: 0, name: "ExportXls", value: false, isDisabled: true, havethis: false, allowedFor: [19, 45, 49] },
      { id: 0, name: "ExportPdf", value: false, isDisabled: true, havethis: false, allowedFor: [18] },
      { id: 0, name: "AssignRole", value: false, isDisabled: true, havethis: false, allowedFor: [12] },
      { id: 0, name: "AssignPermissions", value: false, isDisabled: true, havethis: false, allowedFor: [21] },
      { id: 0, name: "Import Data", value: false, isDisabled: true, havethis: false, allowedFor: [38, 39, 40, 41] },
      { id: 0, name: "Save All", value: false, isDisabled: true, havethis: false, allowedFor: [43] },
    ];

    if (arr && arr.length) {
      arr.map(item => {
        totalPermisison.map(it => {
          if (it.allowedFor.includes(item.id)) {
            it.id = item.id;
            // it.value = false
            it.havethis = true;
          }
        })
      });
    }
    return totalPermisison;
  }

  getAllRoles() {
    this.loading = true;
    this.userService.getAllRoles().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.roles = res.data;
        this.loading = false;
        this.getAllPermissions();

      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  deleteProduct(role: Roles) {
    const nameCapitalized = role.roleName.charAt(0).toUpperCase() + role.roleName.slice(1);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.userService.deleteRole(role.id).subscribe((res: Response) => {
          if (res.statusCode == 200) {
            if (res.data == 1) {
              this.getAllRoles();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
            }
            else if (res.data == 2) {
              this.loading = false;
              this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
            }
            else {
              this.loading = false;
              this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
            }

          }
        })

      }
    });
  }

  openNew() {
    this.editableObject = new Roles();
    this.selectedPermission = [];
    this.mapNewPerm();
    this.submitted = false;
    this.productDialog = true;
  }
  editProduct(user: Roles) {
    this.getRoleById(user);
  }


  getRoleById(role) {
    this.loading = true;
    this.mapNewPerm();
    this.userService.getRoleById(role.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.editableObject = res['data']['role'];
        let yFilter = res['data']['permissions'].map(itemY => { return itemY.id; });
        let obj = this.permissions.filter(item => yFilter.includes(item.id));
        yFilter.forEach(yf => {
          this.newPermissions.map(np => {
            np.alpm.map(al => {
              if (al.id == yf) {
                al.value = true;
              }
            })
            if (np.hasOwnProperty('tabPerms')) {
              np.tabPerms.forEach(pTabs => {
                if (pTabs.id == yf)
                  pTabs.value = true

              })
              // np.tabPerms.newRequest = yFilter.includes(74);
              // np.tabPerms.chinaReview = yFilter.includes(75);
              // np.tabPerms.finalAprove = yFilter.includes(76);
              // np.tabPerms.history = yFilter.includes(77);
            }
          })
        });
        this.selectedPermission = obj;
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
    if (this.editableObject.roleName.trim() && this.editableObject.roleDesc.trim()) {
      this.itemLoading = true;
      let arr: any[] = [];
      this.newPermissions.forEach(np => {
        np.alpm.filter(al => al.value).map(ip => arr.push(ip.id));
        if (np.hasOwnProperty('tabPerms')) {
          np.tabPerms.filter(al => al.value).map(ip => arr.push(ip.id));
        }
      })
      let newArr = this.permissions.filter(op => arr.includes(op.id))
      let data = {
        id: this.editableObject.id ? this.editableObject.id : 0,
        role: {
          id: this.editableObject.id ? this.editableObject.id : 0,
          roleName: this.editableObject.roleName,
          roleDesc: this.editableObject.roleDesc,
          isSysAdmin: false
        },
        permissions: newArr
      }
      if (this.editableObject.id) {
        this.userService.addNewPersmission(data).subscribe((response: Response) => {
          if (response.statusCode == 200 && response.data > 0) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new Roles();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllRoles();
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
            this.itemLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
          }
        }, error => {
        });
      }
      else {
        this.userService.addNewPersmission(data).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new Roles();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllRoles();
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

  disableOther(pgName, name, val) {
    this.newPermissions.map(p => {
      if (p.pageName === pgName) {
        p.alpm.map(pm => {
          if (val)
            pm.isDisabled = false;
          else
            pm.isDisabled = true;
          if (pm.name == 'View') {
            pm.isDisabled = false;
          }
        })
      }
    })
  }




  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-settings',
      url: "/setting/roles",
      shortcutName: "Roles",
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
    this.dtMmgmtService.getSortcutName('Roles').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }


}
