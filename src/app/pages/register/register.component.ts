import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MessageService } from 'primeng/api';
import {
  CustomValidators,
  matchOtherValidator,
} from 'src/app/helpers/must-match.validator';
import { Response } from 'src/app/models/response';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  isBtnDisabled: boolean = false;
  uname_req: string;
  uname_must: string;
  pswd_req: string;
  user_name: string;
  valid_uname: string;
  enter_pswd: string;
  email: string;
  show: boolean = false;
  emailvalue: any;
  emailMismatch: boolean;
  regemail: boolean;
  validemail: boolean;
  currentDate: string;
  mathCaptcha: {
    matchCapNum1: any;
    matchCapNum2: any;
    matchCapResult: any;
    mathCapInputError: any;
    mathCapInput: any;
  } = {
    matchCapNum1: 0,
    matchCapNum2: 0,
    matchCapResult: 0,
    mathCapInputError: '',
    mathCapInput: '',
  };
  is_captcha: boolean;
  isRecaptcha: boolean;
  constructor(
    private toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.currentDate = this.formatDate();
  }

  resolved(captchaResponse: string) {
    this.is_captcha = false;
    this.isRecaptcha = true;
  }
  formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnInit(): void {
    this.initLogin();
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.mathCaptcha.mathCapInputError = '';
    this.mathCaptcha.matchCapNum1 = Math.ceil(Math.random() * 20);
    this.mathCaptcha.matchCapNum2 = Math.ceil(Math.random() * 20);
    this.mathCaptcha.matchCapResult =
      this.mathCaptcha.matchCapNum1 + this.mathCaptcha.matchCapNum2;
    this.mathCaptcha.mathCapInput = '';
  }

  isCaptchaVerify() {
    if (this.mathCaptcha.matchCapResult != this.mathCaptcha.mathCapInput) {
      this.generateCaptcha();
      this.mathCaptcha.mathCapInputError = 'Captcha Failed, Please re-try';
      // this.toastr.errorToastr(this.mathCaptcha.mathCapInputError);
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Captcha Failed, Please re-try',
        life: 3000,
      });

      return false;
    }
    return true;
  }

  initLogin() {
    this.registerForm = this.formBuilder.group({
      // email: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      //password: ['', [Validators.required, Validators.minLength(8)]]
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(/[@$#^!%*&!%*(?)_=+-]/, {
            hasSpecialCharacters: true,
          }),
          Validators.minLength(8),
        ]),
      ],
      passwordConfirm: [
        '',
        [Validators.required, matchOtherValidator('password')],
      ],
      // dob: ['', [Validators.required]],
      company: ['', [Validators.required]],
      comment: [''],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  register(form) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      // let dt = form.dob ? new Date(form.dob) : new Date();
      // if (!this.isCaptchaVerify()) {
      //   return;
      // }
      if (!this.isRecaptcha && location.href.indexOf('localhost:4200') == -1) {
        this.is_captcha = true;
        this.toastr.errorToastr('Captcha is required');
        return;
      }
      let dt = new Date();
      // let formated = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
      let formated = `${dt.getMonth() + 1}-${dt.getDate()}-${dt.getFullYear()}`;
      const input_data = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        company: form.company,
        comment: form.comment,
        phone: form.phone,
        status: 1,
        dob: formated,
      };

      this.isBtnDisabled = true;
      this.userService.register(input_data).subscribe(
        (res: Response) => {
          if (res.statusCode == 200 && res.data > 0) {
            this.setCookie(input_data.email + 'newDevice', 'true', 365);
            this.toastr.successToastr(res.message, 'Please login');
            this.router.navigate(['/login']);
          } else if (res.data == 0) {
            this.toastr.errorToastr(res.message);
          } else if (res.data == -1) {
            this.toastr.errorToastr(res.message);
          }
          this.isBtnDisabled = false;
        },
        (error) => {
          this.isBtnDisabled = false;
          this.toastr.errorToastr('Oops something went wrong');
        }
      );
    }
  }

  setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  password() {
    this.show = !this.show;
  }

  email_verify($event) {
    this.emailMismatch = false;
    this.emailvalue = $event.target.value;
    let email = this.validateEmail(this.emailvalue);
    if (email) {
    } else {
      this.regemail = false;
      this.validemail = true;
    }
  }

  validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validateDec(key) {
    //getting key code of pressed key
    var keycode = key.which ? key.which : key.keyCode;
    //comparing pressed keycodes
    if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) {
      return false;
    } else {
      var parts = key.srcElement.value.split('.');
      if (parts.length > 1 && keycode == 46) return false;
      return true;
    }
  }
}
