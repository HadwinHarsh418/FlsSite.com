import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomValidators } from 'src/app/helpers/must-match.validator';
import { Response } from 'src/app/models/response';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPwdForm: FormGroup;
  submitted = false;
  id: any;
  isBtnDisabled = false;
  mismatch: boolean = false;
  passvalue: string = "";
  red: boolean = false;
  is_captcha: boolean = false;
  isRecaptcha: boolean = false;
  show: boolean;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastr: ToastrManager
  ) {
    this.resetPwdForm = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[@$#^!%*&!%*(?)_=+-]/, { hasSpecialCharacters: true }),
        Validators.minLength(8),
      ])],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.route.params.forEach((params: Params) => {
      this.id = params['id'];
    })
  }


  ngOnInit(): void {
  }
  get f() { return this.resetPwdForm.controls; }

  resetPwd(form) {
    this.submitted = true;
    this.mismatch = false;
    if (form.passwordConfirm == "") {
      this.mismatch = false;
      return
    }
    if (form.password != form.passwordConfirm) {
      this.mismatch = true;
      return
    } else {
      this.mismatch = false;
    }
    if (this.resetPwdForm.invalid) {
      return;
    } else {
      const input_data = {
        "token": this.id,
        "newPassword": form.password,
        // "confPassword": form.passwordConfirm
      }
      this.isBtnDisabled = true;
      this.userService.resetPassword(input_data).subscribe((response: Response) => {
        if (response.statusCode == 200) {
          this.isBtnDisabled = false;
          this.toastr.successToastr(response['message']);
          this.router.navigate(["login"]);
        } else {
          this.isBtnDisabled = false;
          this.toastr.errorToastr(response['message']);
        }
      }, error => {
        this.isBtnDisabled = false;
        this.toastr.errorToastr('System is in maintenance, try after few minutes.');
      });
    }
  }

  onEnter() {
    this.mismatch = false;
  }

  password() {
    this.show = !this.show;
  }
}
