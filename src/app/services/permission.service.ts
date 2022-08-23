import { Injectable } from '@angular/core';
import { FineLinePermissions } from 'src/app/models/finelinePermission'
import { UserService } from './user.service';



@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  allowedMenus: any[] = [];

  allPermission: FineLinePermissions[] =
    [
      { id: 1, permissionDesc: "Insert Item", permissionName: "Add Items", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 2, permissionDesc: "Update Item", permissionName: "Edit Items", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 3, permissionDesc: "View Item", permissionName: "View Items", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 4, permissionDesc: "Delete Item", permissionName: "Delete Items", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 5, permissionDesc: "Set Visible Columns", permissionName: "Data Managment", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 6, permissionDesc: "Import Item CSV", permissionName: "Import Item CSV", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 7, permissionDesc: "Set Two Factor Authentication", permissionName: "Two Factor Authentication", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 8, permissionDesc: "Add Roles", permissionName: "Add Roles", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 9, permissionDesc: "Update Roles", permissionName: "Update Roles", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 10, permissionDesc: "View Roles", permissionName: "View Roles", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 11, permissionDesc: "Delete Roles", permissionName: "Delete Roles", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 12, permissionDesc: "Assign Roles", permissionName: "Assign Roles", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 13, permissionDesc: "Add Users", permissionName: "Add Users", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 14, permissionDesc: "Update Users", permissionName: "Update Users", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 15, permissionDesc: "View Users", permissionName: "View Users", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 16, permissionDesc: "Delete Users", permissionName: "Delete Users", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 17, permissionDesc: "Export Item CSV", permissionName: "Export Item CSV", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 18, permissionDesc: "Export Item PSD", permissionName: "Export Item PSD", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 19, permissionDesc: "Export Item Excel", permissionName: "Export Item Excel", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 20, permissionDesc: "Manage Dashboard", permissionName: "Manage Dashboard", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 21, permissionDesc: "Assign Permissions To Roles", permissionName: "Assign Permissions To Roles", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 22, permissionDesc: "View Ftys", permissionName: "View Ftys", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 23, permissionDesc: "Add Fty", permissionName: "Add Fty", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 24, permissionDesc: "Delete Fty", permissionName: "Delete Fty", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 25, permissionDesc: "Update Fty", permissionName: "Update Fty", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 26, permissionDesc: "View Categories", permissionName: "View Categories", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 27, permissionDesc: "Add Category", permissionName: "Add Category", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 28, permissionDesc: "Delete Category", permissionName: "Delete Category", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 29, permissionDesc: "Update Category", permissionName: "Update Category", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 30, permissionDesc: "View Clp", permissionName: "View Clp", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 31, permissionDesc: "Add Clp", permissionName: "Add Clp", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 32, permissionDesc: "Delete Clp", permissionName: "Delete Clp", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 33, permissionDesc: "Update Category", permissionName: "Update Category", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 34, permissionDesc: "View Pivot Report Data", permissionName: "View Pivot Report", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 35, permissionDesc: "View Daily Items", permissionName: "View Pending Clp", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 36, permissionDesc: "View Logs", permissionName: "View Logs", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 37, permissionDesc: "Sales", permissionName: "View Sales", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 38, permissionDesc: "Upload Items Data", permissionName: "Upload", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 39, permissionDesc: "Upload Clp Data", permissionName: "Upload", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 40, permissionDesc: "Upload Fty Data", permissionName: "Upload", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 41, permissionDesc: "Upload Category Data", permissionName: "Upload", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 42, permissionDesc: "View Fty Notes", permissionName: "Fty Notes", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 43, permissionDesc: "Save All Button", permissionName: "Save All Button", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 44, permissionDesc: "View Logs", permissionName: "View Logs", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 45, permissionDesc: "Export Clp Excel", permissionName: "Export Clp Excel", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 46, permissionDesc: "Export Clp Csv", permissionName: "Export Clp Csv", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 47, permissionDesc: "View Clp Item Review", permissionName: "View Clp Item Review", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 48, permissionDesc: "View CLP Info", permissionName: "View CLP Info", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 49, permissionDesc: "Export Clp Info data to Excel", permissionName: "Export Clp Info data to Excel", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 50, permissionDesc: "Export Clp Info data to CSV", permissionName: "Export Clp Info data to CSV", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 51, permissionDesc: "View Sales permissions", permissionName: "View Sales permissions", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 52, permissionDesc: "View Pdf Operations", permissionName: "View Pdf Operations", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 53, permissionDesc: "Add Price Inquiry", permissionName: "Add Price Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 54, permissionDesc: "Edit Price Inquiry", permissionName: "Edit Price Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 55, permissionDesc: "View Price Inquiry", permissionName: "View Price Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 56, permissionDesc: "View PD Inquiry", permissionName: "View PD Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 57, permissionDesc: "Add PD Inquiry", permissionName: "Add PD Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 58, permissionDesc: "Edit PD Inquiry", permissionName: "Edit PD Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 60, permissionDesc: "View Inventory Queue", permissionName: "View Inventory Queue", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 61, permissionDesc: "Edit Inventory Queue", permissionName: "Edit Inventory Queue", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 62, permissionDesc: "Add Inventory Queue", permissionName: "Add Inventory Queue", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 63, permissionDesc: "Delete Inventory Queue", permissionName: "Delete Inventory Queue", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 64, permissionDesc: "View Sales Detail", permissionName: "View Sales Detail", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 65, permissionDesc: "View Sales Permissions Grid", permissionName: "View Sales Permissions Grid", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 66, permissionDesc: "View Sales Orders", permissionName: "View Sales Orders", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 67, permissionDesc: "Load file data for Sales Report", permissionName: "Load file data for Sales Report", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 68, permissionDesc: "User Department CRUD", permissionName: "User Department CRUD", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 69, permissionDesc: "View User Loc", permissionName: "View User Loc", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 70, permissionDesc: "View Chargeback Claims", permissionName: "View Chargeback Claims", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 71, permissionDesc: "Add Chargeback Claims", permissionName: "Add Chargeback Claims", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 72, permissionDesc: "Edit Chargeback Claims", permissionName: "Edit Chargeback Claims", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 73, permissionDesc: "Delete Chargeback Claims", permissionName: "Delete Chargeback Claims", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 74, permissionDesc: "Tab-New Request", permissionName: "Tab-New Request", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 75, permissionDesc: "Tab-China Review", permissionName: "Tab-China Review", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 76, permissionDesc: "Tab-Final Approval", permissionName: "Tab-Final Approval", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 77, permissionDesc: "Tab-History", permissionName: "Tab-History", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 78, permissionDesc: "Price Inquiry", permissionName: "Delete Price Inquiry", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 79, permissionDesc: "Tab-Archive", permissionName: "Tab-Archive", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 80, permissionDesc: "View all", permissionName: "View all", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 81, permissionDesc: "ShipId Tracker", permissionName: "ShipId Tracker View", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 82, permissionDesc: "ShipId Tracker", permissionName: "ShipId Tracker Edit", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 83, permissionDesc: "ShipId Tracker", permissionName: "ShipId Tracker Add", roleId: 0, permissionId: 0, isPermitted: false },
      { id: 84, permissionDesc: "ShipId Tracker", permissionName: "Delete Ship Id", roleId: 0, permissionId: 0, isPermitted: false },



    ]

  currPermission: FineLinePermissions[];
  dispMenu: any[] = [];
  constructor(private userService: UserService) {
    let o = localStorage.getItem('rolPrm');
    if (o) {
      this.mapPermissions(JSON.parse(o));
      this.mapMenus();
    }
  }

  reset() {
    this.allowedMenus = [];
    this.allPermission.map(item => {
      item.isPermitted = false;
      return item;
    })
  }

  mapPermissions(currrentPermission: FineLinePermissions[]) {
    this.currPermission = currrentPermission;
    if (!this.currPermission) {
      this.currPermission = this.userService.getPemissions();
    }
    if (this.currPermission) {
      this.allPermission.map(
        item => item.isPermitted = (this.currPermission.findIndex(cp => cp.id == item.id) > -1)
      );
    }
  }

  mapMenus() {
    this.allowedMenus = [
      { id: 1, icon: 'ti-home sidemenu-icon', title: 'Dashboard', path: '/dashboard', roles: [], canView: this.getPermissionStatus(20) },
      { id: 2, icon: 'ti-write sidemenu-icon', title: 'All items', path: '/items-list', roles: [], canView: this.getPermissionStatus(3) },
      { id: 3, icon: 'ti-user sidemenu-icon', title: 'Users', path: '/users', roles: [], canView: this.getPermissionStatus(15) },
      { id: 4, icon: 'ti-wallet sidemenu-icon', title: 'Data Management', path: '/data-management', roles: [], canView: this.getPermissionStatus(5) },
      { id: 5, icon: 'ti-wallet sidemenu-icon', title: 'Data Import', path: '/data-import', roles: [], canView: this.getPermissionStatus(6) },
      { id: 6, icon: 'ti-settings sidemenu-icon', title: 'Setting', path: '/setting', roles: [], canView: this.getPermissionStatus(7) },
      { id: 7, icon: 'ti-settings sidemenu-icon', title: 'Roles', path: '/setting/roles', roles: [], canView: this.getPermissionStatus(10) },
      { id: 8, icon: 'ti-settings sidemenu-icon', title: 'Fty', path: '/items-list/fty', roles: [], canView: this.getPermissionStatus(22) },
      { id: 9, icon: 'ti-settings sidemenu-icon', title: 'Category', path: '/items-list/category', roles: [], canView: this.getPermissionStatus(26) },
      { id: 10, icon: 'ti-settings sidemenu-icon', title: 'CLP', path: '/clps', roles: [], canView: this.getPermissionStatus(30) },
      { id: 11, icon: 'ti-settings sidemenu-icon', title: 'Sales Report', path: '/items-list/pivot-report', roles: [], canView: this.getPermissionStatus(37) },
      // { id: 25, icon: 'ti-settings sidemenu-icon', title: 'Sales Report details', path: '/items-list/sales-details', roles: [], canView: this.getPermissionStatus(64) },
      { id: 12, icon: 'ti-settings sidemenu-icon', title: 'Clp Daily POS', path: '/items-list/daily-clp-items', roles: [], canView: this.getPermissionStatus(35) },
      { id: 13, icon: 'ti-settings sidemenu-icon', title: 'Logs', path: '/setting/logs', roles: [], canView: this.getPermissionStatus(36) },
      { id: 14, icon: 'ti-settings sidemenu-icon', title: 'FTY Notes', path: '/items-list/fty-notes', roles: [], canView: this.getPermissionStatus(42) },
      { id: 15, icon: 'ti-settings sidemenu-icon', title: 'Access Logs', path: '/setting/access-logs', roles: [], canView: this.getPermissionStatus(44) },
      { id: 16, icon: 'ti-settings sidemenu-icon', title: 'CLP Review', path: '/clps/review-clp-items', roles: [], canView: this.getPermissionStatus(47) },
      { id: 17, icon: 'ti-settings sidemenu-icon', title: 'CLP INFO', path: '/clps/clp-info', roles: [], canView: this.getPermissionStatus(48) },
      { id: 18, icon: 'ti-settings sidemenu-icon', title: 'Sales Permissions', path: '/setting/sales-permissions', roles: [], canView: this.getPermissionStatus(51) },
      { id: 19, icon: 'ti-files sidemenu-icon', title: 'PDF Operations', path: '/pdf-ops', roles: [], canView: this.getPermissionStatus(52) },
      { id: 20, icon: 'ti-money sidemenu-icon', title: 'Price Inquiry', path: '/items-list/price-inquiry', canView: this.getPermissionStatus(55) },
      { id: 21, icon: 'ti-package sidemenu-icon', title: 'PD Inquiry', path: '/items-list/pd-inquiry', canView: this.getPermissionStatus(56) },
      { id: 22, icon: 'ti-server sidemenu-icon', title: 'Inventory Queue', path: '/items-list/inventory-queue', canView: this.getPermissionStatus(60) },
      { id: 23, icon: 'ti-server sidemenu-icon', title: 'SalesDetail', path: '/items-list/sales-details', canView: this.getPermissionStatus(64) },
      { id: 26, icon: 'ti-settings sidemenu-icon', title: 'SalesPermissionsGrid ', path: '/setting/salesdetailpermission', canView: this.getPermissionStatus(65) },
      // { id: 27, icon:'ti-server sidemenu-icon', title: 'Ag Grid', path: '/items-list/agGrid', canView: this.getPermissionStatus(60) },
      // { id: 28, icon:'ti-server sidemenu-icon', title: 'Demo-grid', path: '/items-list/demo-grid', canView: this.getPermissionStatus(37) },
      // { id: 29, icon:'ti-server sidemenu-icon', title: 'Demo-Api', path: '/items-list/demo-api', canView: this.getPermissionStatus(37) },
      { id: 30, icon: 'ti-write sidemenu-icon', pngIcon: '19.png', title: 'Sales Order ', path: '/items-list/sales-order', canView: this.getPermissionStatus(66) },
      { id: 31, icon: 'ti-write sidemenu-icon', title: 'Chargeback ', path: '/items-list/chargeback-claims', canView: this.getPermissionStatus(70) },
      { id: 32, icon: 'ti-settings sidemenu-icon', title: 'ShipId Tracker', path: '/items-list/ship-id', roles: [], canView: this.getPermissionStatus(81) },
      { id: 33, icon: 'ti-settings sidemenu-icon', title: 'ShipId Tracker', path: '/items-list/ship-id-new', roles: [], canView: this.getPermissionStatus(82) },

      { id: 24, icon: 'ti-settings sidemenu-icon', title: 'no', path: '/no-permission', roles: [], canView: true },
      { id: 25, icon: 'ti-settings sidemenu-icon', title: 'no', path: '/setting/profile', roles: [], canView: true },
       ];


    this.dispMenu = [
      {
        id: 1,
        label: 'Dashboard',
        subMenus: [],
        canViewMainMenu: this.getPermissionStatus(20),
        icon: '',
        noSubmenu: true,
        item: { id: 1, icon: 'ti-home sidemenu-icon', title: 'Dashboard', path: '/dashboard', canView: this.getPermissionStatus(20) },
      },
      {
        id: 2,
        label: 'Sales',
        subMenus: [
          { id: 11, icon: 'ti-pulse sidemenu-icon', title: 'Sales Report', path: '/items-list/pivot-report', canView: this.getPermissionStatus(37) },
          { id: 23, icon: 'ti-pulse sidemenu-icon', title: 'Sales Report Details', path: '/items-list/sales-details', canView: this.getPermissionStatus(64) },
          { id: 30, icon: 'ti-write sidemenu-icon', pngIcon: '19.png', title: 'Sales Order ', path: '/items-list/sales-order', canView: this.getPermissionStatus(66) },
          { id: 20, icon: 'ti-money sidemenu-icon', title: 'Price Inquiry', path: '/items-list/price-inquiry', canView: this.getPermissionStatus(55) },
          { id: 21, icon: 'ti-package sidemenu-icon', title: 'PD Inquiry', path: '/items-list/pd-inquiry', canView: this.getPermissionStatus(56) },

          // { id: 28, icon:'ti-server sidemenu-icon', title: 'Demo-Grid', path: '/items-list/demo-grid', canView: this.getPermissionStatus(37) },
          // { id: 29, icon:'ti-server sidemenu-icon', title: 'Demo-Api', path: '/items-list/demo-api', canView: this.getPermissionStatus(37) },
        ],
        canViewMainMenu: this.getPermissionStatus(37),
        icon: 'ti-pulse sidemenu-icon',
        noSubmenu: false,
        // item: { id: 11, icon: 'ti-pulse sidemenu-icon', title: 'Sales', path: '/items-list/pivot-report', canView: this.getPermissionStatus(37) },
      },
      {
        id: 3,
        label: 'Items',
        canViewMainMenu: false,
        icon: 'ti-write sidemenu-icon',
        subMenus: [
          { id: 2, icon: 'ti-write sidemenu-icon', title: 'Items', path: '/items-list', canView: this.getPermissionStatus(3) },
          // { id: 4, icon: 'ti-wallet sidemenu-icon', title: 'Data Management', path: '/data-management', canView: this.getPermissionStatus(5) },
          // { id: 5, icon: 'ti-wallet sidemenu-icon', title: 'Data Import', path: '/data-import', canView: this.getPermissionStatus(6) },
          { id: 8, icon: 'ti-settings sidemenu-icon', title: 'Fty Table', path: '/items-list/fty', canView: this.getPermissionStatus(22) },
          { id: 9, icon: 'ti-settings sidemenu-icon', title: 'Category', path: '/items-list/category', canView: this.getPermissionStatus(26) },
          { id: 14, icon: 'ti-wallet sidemenu-icon', title: 'Fty Notes', path: '/items-list/fty-notes', canView: this.getPermissionStatus(42) },
          { id: 22, icon: 'ti-server sidemenu-icon', title: 'Inventory Queue', path: '/items-list/inventory-queue', canView: this.getPermissionStatus(60) },
          // { id: 27, icon:'ti-server sidemenu-icon', title: 'Ag Grid', path: '/items-list/agGrid', canView: this.getPermissionStatus(60) },
        ],
        noSubmenu: false,
      },
      {
        id: 4,
        label: 'Admin',
        canViewMainMenu: false,
        icon: 'ti-user sidemenu-icon',
        subMenus: [
          { id: 3, icon: 'ti-user sidemenu-icon', title: 'Users', path: '/users', canView: this.getPermissionStatus(15) },
          // { id: 6, icon: 'ti-settings sidemenu-icon', title: 'Setting', path: '/setting', canView: this.getPermissionStatus(7) },
          { id: 7, icon: 'ti-settings sidemenu-icon', title: 'Roles', path: '/setting/roles', canView: this.getPermissionStatus(10) },
          { id: 13, icon: 'ti-settings sidemenu-icon', title: 'Logs', path: '/setting/logs', canView: this.getPermissionStatus(36) },
          { id: 15, icon: 'ti-settings sidemenu-icon', title: 'Access Logs', path: '/setting/access-logs', canView: this.getPermissionStatus(44) },
          { id: 18, icon: 'ti-settings sidemenu-icon', title: 'Sales Permissions', path: '/setting/sales-permissions', roles: [], canView: this.getPermissionStatus(51) },
          { id: 26, icon: 'ti-settings sidemenu-icon', title: 'Sales Permission Detail ', path: '/setting/salesdetailpermission', canView: this.getPermissionStatus(65) },
        ],
        noSubmenu: false,
      },
      {
        id: 5,
        label: 'CLP',
        canViewMainMenu: false,
        icon: 'ti-settings sidemenu-icon',
        subMenus: [
          { id: 10, icon: 'ti-settings sidemenu-icon', title: 'CLP', path: '/clps', canView: this.getPermissionStatus(30) },
          { id: 12, icon: 'ti-wallet sidemenu-icon', title: 'CLP Daily POS', path: '/items-list/daily-clp-items', canView: this.getPermissionStatus(35) },
          { id: 16, icon: 'ti-settings sidemenu-icon', title: 'CLP Review', path: '/clps/review-clp-items', canView: this.getPermissionStatus(47) },
          { id: 17, icon: 'ti-info-alt sidemenu-icon', title: 'CLP Info', path: '/clps/clp-info', canView: this.getPermissionStatus(48) },
          { id: 31, icon: 'ti-write sidemenu-icon', title: 'Chargeback ', path: '/items-list/chargeback-claims', canView: this.getPermissionStatus(70) },
          { id: 33, icon: 'ti-settings sidemenu-icon', title: 'ShipId Tracker', path: '/items-list/ship-id-new', roles: [], canView: this.getPermissionStatus(82) },
          { id: 32, icon: 'ti-settings sidemenu-icon', title: 'ShipId Tracker Old', path: '/items-list/ship-id', roles: [], canView: this.getPermissionStatus(81) },

        ],
        // item:,
        noSubmenu: false,
      },
      {
        id: 6,
        label: 'PDF Operations',
        subMenus: [],
        canViewMainMenu: this.getPermissionStatus(52),
        icon: '',
        noSubmenu: true,
        item: { id: 19, icon: 'ti-files sidemenu-icon', title: 'PDF Operations', path: '/pdf-ops', canView: this.getPermissionStatus(52) },
      },
      // {
      //   id: 7,
      //   label: 'Order',
      //   canViewMainMenu: false,
      //   icon: 'ti-settings sidemenu-icon',
      //   subMenus: [
      //     { id: 30, icon: 'ti-settings sidemenu-icon', title: 'Open Orders', path: '/order', canView: this.getPermissionStatus(66) },
      //   ],
      //   noSubmenu: false,
      //   }
    ]


    this.dispMenu.map(item => {
      item.canViewMainMenu = (item.canViewMainMenu) ? item.canViewMainMenu : item.subMenus.filter(it => it.canView).length > 0 ? true : false;
    })

  }

  getPermissionStatus(id: number) {
    return this.allPermission.findIndex(cp => cp.id == id && cp.isPermitted == true) > -1;
  }

  //roles Permission mappping
  mapPemissions(arr) {
    let totalPermisison: any[] = [
      { id: 0, name: "View", value: false, isDisabled: false, havethis: false, allowedFor: [3, 6, 22, 5, 7, 10, 15, 20, 26, 30, 35, 36, 37, 42, 44, 47, 48, 51, 52, 55, 56, 60, 64, 65, 66, 67, 68, 69, 70,81] },
      { id: 0, name: "Add", value: false, isDisabled: true, havethis: false, allowedFor: [1, 23, 8, 13, 27, 31, 53, 57, 62, 71,83] },
      { id: 0, name: "Edit", value: false, isDisabled: true, havethis: false, allowedFor: [2, 25, 9, 14, 29, 33, 54, 58, 61, 72,82] },
      { id: 0, name: "Delete", value: false, isDisabled: true, havethis: false, allowedFor: [4, 24, 11, 16, 28, 32, 63, 73, 84] },
      { id: 0, name: "ExportCsv", value: false, isDisabled: true, havethis: false, allowedFor: [17, 46, 50] },
      { id: 0, name: "ExportXls", value: false, isDisabled: true, havethis: false, allowedFor: [19, 45, 49] },
      { id: 0, name: "ExportPdf", value: false, isDisabled: true, havethis: false, allowedFor: [18] },
      { id: 0, name: "AssignRole", value: false, isDisabled: true, havethis: false, allowedFor: [12] },
      { id: 0, name: "AssignPermissions", value: false, isDisabled: true, havethis: false, allowedFor: [21] },
      { id: 0, name: "Import Data", value: false, isDisabled: true, havethis: false, allowedFor: [38, 39, 40, 41] },
      { id: 0, name: "Save All", value: false, isDisabled: true, havethis: false, allowedFor: [43] },
    ]
    if (arr && arr.length) {
      arr.map(item => {
        totalPermisison.map(it => {
          if (it.allowedFor.includes(item.permissionId)) {
            it.id = item.permissionId;
            it.havethis = true;
            it.value = true;

          }
        })
      });
    }
    return totalPermisison;
  }

}