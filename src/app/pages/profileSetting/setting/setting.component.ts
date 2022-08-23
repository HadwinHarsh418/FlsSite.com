import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MessageService } from 'primeng/api';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  googleauthData: any;
  sixDigitCode: any;
  isSecurityEnabled: boolean = false;
  isGoogleAuthEnabled: boolean = false;
  loadingSecurityData: boolean = false;
  toDisableSecurityQuestion: boolean;
  currentUser: Users;
  loadingShortCut: boolean;
  stCode: number = 0;

  constructor(
    private userService: UserService,
    private toastr: ToastrManager,
    private messageService: MessageService,
    private dtMmgmtService: DataManagementService

  ) {
    this.getShortCutStatus();

  }

  ngOnInit(): void {
    this.currentUser = this.userService.tokenKey.user;
    if (this.currentUser.isTwoFactAuth != '0') {
      this.isGoogleAuthEnabled = true
    }

  }

  enableDisable(type) {

    setTimeout(() => {
      if (this.isGoogleAuthEnabled) {
        this.isSecurityEnabled = false;
        this.googleauthData = {
          qrcode: "data:image/png;base64,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"
        }
        // if (this.currentUser.isTwoFactAuth == '0') {
        //   this.loadingSecurityData = true;
        //   this.userService.twoFactAuthEnable({ user_id: this.currentUser.user_id }).subscribe(res => {
        //     if (res.success) {
        //       this.googleauthData = {
        //         qrcode: "data:image/png;base64,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"
        //       }
        //     } else {
        //       this.toastr.errorToastr(res.message);
        //       this.isGoogleAuthEnabled = false;
        //     }
        //     this.loadingSecurityData = false;
        //   }, error => {
        //     this.toastr.errorToastr('Something went wrong, Please try again');
        //     this.isGoogleAuthEnabled = false;
        //     this.loadingSecurityData = false;
        //   });
        // }
      }
    }, 10);
  }


  submitEnableGoogleAuth() {
    if (this.sixDigitCode && this.sixDigitCode.length == 6) {
      this.loadingSecurityData = true;
      // this.dataService.twoFactAuthVerifyFromLogin({ authcode: this.sixDigitCode, user_id: this.currentUser.user_id }).subscribe(res => {
      //   if (res.success) {
      //     this.currentUser.two_fa_actived = '1';
      //     sessionStorage.setItem('two_fa_actived', '1');
      //     this.toastr.successToastr(res.message);
      //     this.googleauthData = null;
      //   } else {
      //     this.toastr.errorToastr(res.message);
      //   }
      //   this.sixDigitCode = '';
      //   this.loadingSecurityData = false;
      // }, error => {
      //   this.loadingSecurityData = false;
      //   this.sixDigitCode = '';
      //   this.isGoogleAuthEnabled = false;
      // });
    } else {
      this.toastr.errorToastr('Enter a valid Code');
    }
  }

  changedSixdigit() {
    this.sixDigitCode = this.sixDigitCode.trim().length > 6
      ? this.sixDigitCode.trim().substr(0, 6) : this.sixDigitCode.trim();
  }
  submitDisableGoogleAuth() {
    if (this.sixDigitCode && this.sixDigitCode.length == 6) {
      this.loadingSecurityData = true;
      // this.dataService.twoFactAuthDisable({ authcode: this.sixDigitCode, user_id: this.currentUser.user_id }).subscribe(res => {
      //   if (res.success) {
      //     this.currentUser.two_fa_actived = '0';
      //     sessionStorage.setItem('two_fa_actived', '0');
      //     this.toastr.successToastr(res.message);
      //     this.googleauthData = null;
      //   } else {
      //     this.toastr.errorToastr(res.message);
      //   }
      //   this.sixDigitCode = '';
      //   this.loadingSecurityData = false;
      // }, error => {
      //   this.loadingSecurityData = false;
      //   this.sixDigitCode = '';
      //   this.isGoogleAuthEnabled = false;
      // } );
    } else {
      this.toastr.errorToastr('Enter a valid Code');
    }
  }

  activate2Fa(val) {
    const body = {
      email: this.currentUser.email,
      isEnable: this.isGoogleAuthEnabled
    }
    this.userService.enable2Fa(body).subscribe((res: Response) => {
      if (res.statusCode == 200 && res.data == 1) {
        this.isGoogleAuthEnabled = this.isGoogleAuthEnabled
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this.set2Fa(this.isGoogleAuthEnabled);
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  set2Fa(val) {
    if (val) {
      this.currentUser.isTwoFactAuth = '1';
    }
    else {
      this.currentUser.isTwoFactAuth = '0'
    }
    const user = this.currentUser
    const token = this.userService.tokenKey.token
    let loginResponse = { user: user, token: token }
    this.userService.setToken(loginResponse);

  }



  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-settings',
      url: "/setting",
      shortcutName: "Setting",
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
    this.dtMmgmtService.getSortcutName('Setting').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }


}
