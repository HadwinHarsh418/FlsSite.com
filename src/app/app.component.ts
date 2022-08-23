import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fls';
  location: Location;

  constructor(private userService: UserService, private router: Router) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        const body = document.getElementsByTagName('body')[0];
        // body.classList.add('main-sidebar-hide');
        body.classList.remove('main-sidebar-show', 'main-sidebar-open', 'modal-open');
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
      }
    });

    window.onbeforeunload = () => {
      if (location.href.indexOf('localhost:4200') == -1) {
        this.userService.logout();
      }
    }
  }
  ngOnInit() {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
      if (location.pathname != 'dashboard') {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('main-sidebar-hide');
      }
    }
  }
}
