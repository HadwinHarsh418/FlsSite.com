import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showMainmenu: boolean;
  user: Users;
  imagePath: string;
  // @ViewChild('nav') sidenav;
  constructor(private userService: UserService, private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // this.openMainmenu();
        this.showMainmenu = false

      }
    });
    this.userService.profilePicUpdate.subscribe(res => {
      if (res) {
        this.ngOnInit();
      }
    })
  }

  ngOnInit(): void {
    this.user = this.userService.tokenKey.user;
    let img = this.user.imagePath;
    if (!img) {
      this.imagePath = 'assets/images/user.jpg';
    }
    else {
      this.imagePath = environment.imgUlr + '/' + img;
    }
  }
  openMainmenu(ev: Event) {
    ev.stopPropagation();
    this.showMainmenu = !this.showMainmenu;
  }

  logout() {
    this.userService.logout();
  }


  ngDestroy() {
    this.userService.profilePicUpdate.complete();
  }
}
