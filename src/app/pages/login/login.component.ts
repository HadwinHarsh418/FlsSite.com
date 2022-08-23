import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MessageService } from 'primeng/api';
import { AESHelper } from 'src/app/helpers/encLogin/aes-helper';
import { RSAHelper } from 'src/app/helpers/encLogin/rsa-helper';
import { Config } from 'src/app/models/Config';
import { loginRes } from 'src/app/models/loginResponse';
import { TokenResponse } from 'src/app/models/tokenData';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';
import { Users } from '../../models/users';
import { AuthService } from '../../services/auth.service';

//import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  code: FormArray;
 
  submitted = false;
  isRecaptcha: boolean = false;
  is_captcha: boolean = false;
  isBtnDisabled: boolean = false;
  ip_address: string;
  current_city: string;
  deviceInfo: any;
  loginResponse: TokenResponse;
  uname_req: string;
  uname_must: string;
  pswd_req: string;
  setLang: boolean = false;
  user_name: string;
  valid_uname: string;
  password_error: string;
  captcha_error: string;
  isRemember: boolean = false;
  checked: boolean = false;
  check_box: boolean = false;
  cookieEamil: any;
  cookiePassword: any;
  e_address: string;
  enter_pswd: string;
  email: string;
  show: boolean = false;
  sixDigitCode: any;
  loadingSecurityData: boolean;
  showAuthTokenModal: boolean = false;
  errorMsg: string = '';
  isSkipTwoFactAuth: boolean = false
  body:any;
  isEnable:any
  twoFactAuthQr: boolean;
  gettingQr:boolean;
  qrResponse:any;
  otp: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config :Config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp) {
    this.otp = otp;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }
  constructor(
    private fb: FormBuilder,
    private encrypt:AuthService,
    private toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    private aesHelper:AESHelper,
    private rsaHelper:RSAHelper

  ) {

    this.cookieEamil = this.getCookie('flsLoginEmail');
    this.cookiePassword = this.getCookie('flsLoginPassword');
    this.initLogin();
  }

 
  ngOnInit(): void {
  
     //const encrypted = this.encrypt.encryptionAES('hello world');
   // const decrypted = this.encrypt.decryptionAES(encrypted);
  }


  initLogin() {
    this.loginForm = this.formBuilder.group({
      email: [this.cookieEamil, [Validators.required]],//, Validators.email
      //password: ['', [Validators.required, Validators.minLength(8)]]
      password: [this.cookiePassword, [Validators.required]],
      isRemember: [(this.cookieEamil && this.cookiePassword)]

    });
   
   
    const controls = [];
    for (let i = 1; i < 6; i++) {
      controls.push([ '',[Validators.required]]);
    }
    this.code = this.fb.array(controls);
  }


  get f() { return this.loginForm.controls; }

  // encrypt = function (loginForm, key='0n3v1ew') {
  //   return CryptoJS.AES.encrypt(loginForm, key).toString();

  // }
  login(form) {
    // const encrypted = this.encrypt.encryptionAES(
    //   JSON.stringify(form)
    //   //,'secret key 123' 
    const aesKeyValue = this.aesHelper.aesKey();
    const rsaKey = this.rsaHelper.encryptWithPublicKey(aesKeyValue);
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      const input_data = {
        "email": form.email,
        "pass": form.password,
      }
      this.isBtnDisabled = true;
      this.userService.login(input_data,rsaKey).subscribe((res: loginRes) => {
        if (res['response']['statusCode'] == 200 && res['userdata']['response'] == 1) {
          if (this.loginForm.get('isRemember').value) {
            this.setCookie('flsLoginEmail', form.email, 365)
            this.setCookie('flsLoginPassword', form.password, 365)
          } else {
            this.setCookie('flsLoginEmail', form.email, -365)
            this.setCookie('flsLoginPassword', form.password, -365)
          }
          const user = res['userdata'];
          user.roles = res['response']['data']['roles'] || [];
          user.roleArray = []; 
          user.roles.forEach(item => { user.roleArray.push(item.role) })
          const token = res['response']['data']['token'];
          this.permissionService.mapPermissions(res['response']['data']['permissions']);
          this.loginResponse = { user: user, token: token }
          this.userService.setPermissions(res['response']['data']['permissions']);
          this.permissionService.mapMenus();
          let twoFA = res.userdata.isTwoFactAuth;
          let isQrSet = res.userdata.isQrSet;
          const checkTrustMe = this.getCookie(this.loginResponse.user.email);
          if(twoFA == '1') {
            if(isQrSet) {
              this.open2FAWindow();
            } else {
              this.openQrWindow();
            }
          } else {
            // this.openQrWindow();
            this.makeSession(this.loginResponse);
          }
          // if (twoFA == '1') {
          //   let cok = this.getCookie(this.loginResponse.user.email + 'newDevice')
          //   if (!cok || cok != 'true') {
          //     this.sendEmailForDevice();
          //   }
          //   this.sendVerificationEmailCode();
          //   this.open2FAWindow();
          // }
          // else {
            //  if(user.isTwoFactAuth != '1') {
              // this.makeSession(this.loginResponse);
            // } else {
            //   this.open2FAWindow();
            // }
          // }
        }
        else if (res.response.statusCode == 401 && res['userdata']['response'] == 0) {
          this.errorMsg = res.response.message;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.response.message, life: 3000 });
        }
        else if (res['response']['statusCode'] == 401 && res.userdata.response == 2) {
          // this.errorMsg = `You have made ${res.userdata.loginAttempts} wrong attempts out of 10`
          this.errorMsg = res.response.message;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.response.message, life: 3000 });
        }
        else if (res['response']['statusCode'] == 401 && res.userdata.response == 3) {
          this.errorMsg = res.response.message;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.response.message, life: 3000 });
        }
        else if (res.response.statusCode == 401 && res['userdata']['response'] == 4) {
          this.errorMsg = res.response.message;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.response.message, life: 3000 });
        }
        else if (res.response.statusCode == 401 && res['userdata']['response'] == 5) {
          this.errorMsg = res.response.message;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.response.message, life: 3000 });
        }
        this.isBtnDisabled = false;

      }, error => {
        this.isBtnDisabled = false;
        this.toastr.errorToastr('Oops something went wrong')
      })

    }
  }

  sendVerificationEmailCode() {
    const body = {
      firstName: this.loginResponse.user.firstName,
      lastName: this.loginResponse.user.lastName,
      email: this.loginResponse.user.email
    }
    this.userService.sendsendVerficationEmailEmail(body, this.loginResponse.token).subscribe((res) => {
      if (res.statusCode == 200) {
      }
    })

  }

  sendEmailForDevice() {
    const body =
    {
      firstName: this.loginResponse.user.firstName,
      lastName: this.loginResponse.user.lastName,
      email: this.loginResponse.user.email
    }
    this.userService.sendEmail(body, this.loginResponse.token).subscribe((res) => {
      if (res.statusCode == 200) {

      }
    })
  }




  setCookie(cname, cvalue, exdays) {
    try {
      let d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } catch(error) {
    }
  }

  getCookie(cname) {
    var name = cname + "=";
    try {
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    } catch(error) {
      return "";
    }
  }

  openQrWindow() {
    this.twoFactAuthQr = true;
    this.getQr();
  }

  getQr(){
    this.qrResponse = null;
    this.gettingQr = true;
    this.userService.withTokenGooglelogin(this.loginResponse.token).subscribe(
      res => {
        this.gettingQr = false;
        if(res['statusCode'] == 200) {
          this.qrResponse = res['data'];
        }
      }, error => {
        this.gettingQr = false;
      }
    );
  }

  open2FAWindow() {
    this.showAuthTokenModal = true;
  }

  closneModal() {
    this.twoFactAuthQr = false;
    this.submitted = false;
  }

  hideDialog() {
    this.showAuthTokenModal = false;
    this.submitted = false;
  }

  makeSession(loginData) {
    this.getAllpermissionsById();
    this.setCookie(this.loginResponse.user.email + 'newDevice', 'true', 365);

    setTimeout(() => {
      this.userService.setToken(loginData);
      // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Logged In successfully', life: 3000 });
      this.toastr.successToastr('Logged In successfully')
      this.router.navigate(['/dashboard']);
    }, 300);
  }
  password() {
    this.show = !this.show;
  }

  activateGoogleauth() {
    if (this.otp && this.otp.length == 6) {
      this.loadingSecurityData = true;
      const body = {
        pin : this.otp
      };
      this.userService.VerifyGooglePin(body, this.loginResponse.token).subscribe((resp) => {
        if (resp['statusCode'] == 200 && resp['data']) {
          this.userService.getStatusForTwoFa({email: this.loginResponse.user.email}, this.loginResponse.token).subscribe(
            res => {}
          );
          this.makeSession(this.loginResponse);
          this.twoFactAuthQr = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: resp['message'], life: 3000 });
        }
        this.otp = '';
        this.loadingSecurityData = false;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
        this.loadingSecurityData = false;
        this.otp = '';
      }
      );
    } else {
      this.toastr.errorToastr('Enter a valid Code');
    }
  }

  verifyGoogleAuth() {
    if (this.otp && this.otp.length == 6) {
      this.loadingSecurityData = true;
      // const body = {
      //   email: this.loginResponse.user.email,
      //   authCode: this.sixDigitCode,
      //   isSkipTwoFactAuth: this.isSkipTwoFactAuth
      // }
      const body = {
        pin : this.otp
      };
      if (true)
        this.setCookie(this.loginResponse.user.email, 'yes', 14);
       this.userService.VerifyGooglePin(body, this.loginResponse.token).subscribe((resp) => {
        if (resp['statusCode'] == 200 && resp['data']) {
          this.makeSession(this.loginResponse);
          this.showAuthTokenModal = false;
          // if (this.isSkipTwoFactAuth) {
          //   this.loginResponse.user.isSkipTwoFactAuth = this.isSkipTwoFactAuth;  
          // }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: resp['message'], life: 3000 });
        }
        this.otp = '';
        this.loadingSecurityData = false;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
        this.loadingSecurityData = false;
        this.otp = '';
      }
      );
    } else {
      this.toastr.errorToastr('Enter a valid Code');
    }
  }
  changedSixdigit() {
    this.sixDigitCode = this.sixDigitCode.trim().length > 6
      ? this.sixDigitCode.trim().substr(0, 6) : this.sixDigitCode.trim();
  }

  getAllpermissionsById() {
    // this.userService.getAllPersmissionByUserId(this.loginResponse.user.id).subscribe((res: Response) => {
    //   if (res.statusCode == 200) {
    //     this.permissionService.mapPermissions(res.data);
    //   }
    //   else {
    //     this.permissionService.reset();
    //   }
    // })
  }

  transformEmail(value: string): string {

    return value ? value.replace(/\B.+@/g, (c,) => c.split('').slice(0, -1).map(v => '*').join('') + '@') : value;
  }


  // moveToNext(event) {
  //   let next = event.target.nextElementSibling;
  //   if (next) {
  //     next.focus();
  //   } else {
  //     event.target.blur();
  //   }
//}

  
}
