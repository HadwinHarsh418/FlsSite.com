import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { loginRes } from 'src/app/models/loginResponse';
import { Response } from 'src/app/models/response';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  user_id: any;
  isBtnDisabled: boolean = false;
  submitted: boolean = false;
  emailvalue: string = "";
  red: boolean = false;
  green: boolean = false;
  is_captcha: boolean = false;
  isRecaptcha: boolean = false;
  mathCaptcha: {
    matchCapNum1: any, matchCapNum2: any, matchCapResult: any,
    mathCapInputError: any, mathCapInput: any
  } =
    {
      matchCapNum1: 0, matchCapNum2: 0, matchCapResult: 0,
      mathCapInputError: '', mathCapInput: ''
    }

  
  constructor(
    private userService: UserService,
    public toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.generateCaptcha();
  }

  
  generateCaptcha() {
    this.mathCaptcha.mathCapInputError = '';
    this.mathCaptcha.matchCapNum1 = Math.ceil(Math.random() * 20);
    this.mathCaptcha.matchCapNum2 = Math.ceil(Math.random() * 20);
    this.mathCaptcha.matchCapResult = this.mathCaptcha.matchCapNum1 + this.mathCaptcha.matchCapNum2;
    this.mathCaptcha.mathCapInput = '';
  }

  isCaptchaVerify() {
    if (this.mathCaptcha.matchCapResult != this.mathCaptcha.mathCapInput) {
      this.generateCaptcha();
      this.mathCaptcha.mathCapInputError = 'Captcha Failed, Please re-try';
      this.toastr.errorToastr('Captcha Failed, Please re-try');

      return false;
    }
    return true;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  resolved(captchaResponse: string) {
    this.is_captcha = false;
    this.isRecaptcha = true;
  }

  get f() { return this.forgotForm.controls; }

  onPassEnter($event) {

    this.emailvalue = ($event.target.value);
    let email = this.validateEmail(this.emailvalue);
    if (email) {
      this.green = true;
    } else {
      this.green = false;
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  forgotPassword(form) {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    } else {
      if (!this.isRecaptcha && location.href.indexOf('localhost:4200') == -1) {
        this.is_captcha = true;
        this.toastr.errorToastr('Captcha is required');
        return;
      }

      const input_data = {
        "email": form.email
      }
      this.isBtnDisabled = true;
      this.userService.forgotPassword(input_data).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.isBtnDisabled = false;
          this.toastr.successToastr(response['message']);
          //this.router.navigate(['']);
          this.generateCaptcha();
        } else {
          this.isBtnDisabled = false;
          this.toastr.errorToastr(response['message']);
        }
      }, error => {
        this.isBtnDisabled = false;
        this.toastr.errorToastr("System is in maintenance, try after few minutes.");
      });
    }
  }
  goToLogin() {
    this.router.navigate(["/login"]);
  }
}