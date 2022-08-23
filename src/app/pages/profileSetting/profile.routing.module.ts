import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesDetailPermissionComponent } from './sales-detail-permission/sales-detail-permission.component';
import { AccesslogsComponent } from './accesslogs/accesslogs.component';
import { AssignRolesComponent } from './assign-roles/assign-roles.component';
import { LogsComponent } from './logs/logs.component';
import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';
import { SettingComponent } from './setting/setting.component';
import { SalesPermissionComponent } from './sales-permission/sales-permission.component';
const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'role-assignment',
    component: AssignRolesComponent,
  },
  {
    path: 'logs',
    component: LogsComponent,
  },
  {
    path: 'access-logs',
    component: AccesslogsComponent,
  },
  {
    path: 'sales-permissions',
    component: SalesPermissionComponent,
  },
  {
    path: 'salesdetailpermission',
    component: SalesDetailPermissionComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
