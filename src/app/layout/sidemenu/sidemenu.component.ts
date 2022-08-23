import { Component, Input, OnInit } from '@angular/core';
import { Menus } from 'src/app/models/menus';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  allMenuItems: Menus[];
  user: Users;
  public hide: boolean = true;

  constructor(
    private permissionService: PermissionService,
    private userService: UserService

  ) {
    this.user = this.userService.tokenKey.user;

    // this.userService.getAllPersmissionByUserId(this.user.id).subscribe((res: Response) => {
    //   if (res.statusCode == 200) {
    //     this.permissionService.mapPermissions(res.data);
    //   }
    //   else {
    //     this.permissionService.reset();
    //   }
    // this.getAllpermissionsById();
    this.setMenus();

    // })
  }


  collapseMenu() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('main-sidebar-hide');
    
  }
  setMenus() {
    this.allMenuItems = this.permissionService.dispMenu;
  }
  ngOnInit(): void {

  }
  get currentLocation() {
    return location
  }

  getAllpermissionsById() {
    this.userService.getAllPersmissionByUserId(this.user.userId).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.permissionService.mapPermissions(res.data);
      }
      else {
        this.permissionService.reset();
      }
    })
  }
}
