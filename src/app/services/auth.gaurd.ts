import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { PermissionService } from './permission.service';


interface RoutePermission {
    currentRoute: string,
    isNotAllowedRedirect: string
}

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService,
        private router: Router,
        private permissionS: PermissionService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let firstAllowed: any = [];
        if (this.userService.isLogined()) {
            if (state.url == '/login') {
                firstAllowed = this.permissionS.allowedMenus.filter(item => item.path == '/dashboard');
                if (firstAllowed[0].canView) {
                    this.router.navigate(['/dashboard']);
                } else {
                    firstAllowed = this.permissionS.allowedMenus.filter(item => item.canView);
                    if (firstAllowed && firstAllowed.length) {
                        this.router.navigateByUrl(firstAllowed[0].path);
                    } else {
                        this.router.navigate(['/no-permissions']);
                        // not-permitted
                        return false;
                    }
                }
            } else {
                firstAllowed = this.permissionS.allowedMenus.filter(item => item.path == state.url);
                if (firstAllowed && firstAllowed.length && firstAllowed[0].canView) {
                    return true
                } else {
                    firstAllowed = this.permissionS.allowedMenus.filter(item => item.canView);
                    if (firstAllowed && firstAllowed.length) {
                        this.router.navigateByUrl(firstAllowed[0].path);
                    } else {
                        this.router.navigate(['/no-permissions']);
                        //  not permitted
                        return false;
                    }
                }
            }
        }
        else {
            if (state.url == '/login') return true;
            this.router.navigate(['/login']);
            return false;
        }
    }
}
