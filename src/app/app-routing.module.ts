import { NgModule } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NoPermissionComponent } from './pages/no-permission/no-permission.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './services/auth.gaurd';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'no-permission',
        component: NoPermissionComponent,
      },

      {
        path: 'items-list',
        // loadChildren: './pages/items/items.module#ItemsModule'
        loadChildren: () =>
          import('./pages/items/items.module').then((m) => m.ItemsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'data-import',
        loadChildren: './pages/dataExport/data-export.module#DataExportModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'data-management',
        loadChildren:
          './pages/data-management/data-management.module#DataManagementModule',
        canActivate: [AuthGuard],
      },
     
      {
        path: 'setting',
        loadChildren: './pages/profileSetting/profile.module#ProfileModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: './pages/users/users.module#UsersModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'clps',
        loadChildren: () =>
          import('./pages/clps/clps.module').then((m) => m.ClpsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'pdf-ops',
        loadChildren: () =>
          import('./pages/pdf-ops/pdf-ops.module').then(
            (pd) => pd.PdfOpsModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
