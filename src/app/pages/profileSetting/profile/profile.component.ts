import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  CustomValidators,
  matchOtherValidator,
} from 'src/app/helpers/must-match.validator';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  selectedState: any = null;

  states: any[] = [
    { name: 'Arizona', code: 'Arizona' },
    { name: 'California', value: 'California' },
    { name: 'Florida', code: 'Florida' },
    { name: 'Ohio', code: 'Ohio' },
    { name: 'Washington', code: 'Washington' },
  ];
  loading: boolean;
  editableObject: Users;
  user: Users;
  submitted: boolean;
  itemLoading: boolean;
  selectedRoles: any;
  psdUpdateForm: FormGroup;
  isBtnDisabled: boolean;
  show: any;
  psdSubmitted: boolean = false;
  isGoogleAuthEnabled: boolean = false;
  imagePath: string;
  file: File;
  modelOpen: boolean = false;
  title = 'appBootstrap';
  closeResult: string = '';
  isLoading: boolean;
  @ViewChild('file', { static: false }) fileupload: ElementRef;
  isSkipTwoFactAuth: boolean = false;
  loadingAuth: boolean = false;
  twoFAdata: any;
  verify: string = 'successful';
  pin: string = '';
 
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.user = this.userService.tokenKey.user;
    this.initLogin();
    this.getProfilePic();
  }
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.getUserById();
    // this.getGoogleAuth();
    this.isSkipTwoFactAuth = this.user.isSkipTwoFactAuth;
    if (this.user.isTwoFactAuth != '0') {
      this.isGoogleAuthEnabled = true;
    }
  }
  sendVerification() {
    if (this.pin.trim()) {
      const body = {
        pin: this.pin,
        verify: this.verify,
      };
      this.userService.googleVerify(body).subscribe((res) => {
        if (res.statusCode == 200) {
          this.getStatusforTwoFa();
        }
      });
    }
    //  else {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error Message',
    //     detail: 'Please enter Two factor code',
    //     life: 3000,
    //   });
    // }
  }

  getStatusforTwoFa() {
    let data = {
      email: this.user.email,
      isEnable: true,
    };
    this.userService.getStatusForTwoFa(data).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        const user = this.user;
        user.isTwoFactAuth = '1';
        const token = this.userService.tokenKey.token;
        let data = { user: user, token: token };
        this.userService.setToken(data);
      }
    });
  }

  // getGoogleAuth() {
  //   this.loadingAuth = true;
  //   this.userService.googlelogin().subscribe((res: Response) => {
  //     if (res.statusCode == 200) {
  //       this.twoFAdata = res['data'];
  //       this.loadingAuth = false;
  //     }
  //   });
  // }

  getUserById() {
    this.loading = true;
    this.userService
      .getUserById(this.user.userId)
      .subscribe((res: Response) => {
        if (res.statusCode == 200) {
          this.editableObject = { ...res.data };
          // if (!this.editableObject.roles)
          //   this.editableObject.roles = [];
          // let yFilter = this.editableObject.roles.map(itemY => { return itemY.roleId; });
          // let obj = this.roles.filter(item => yFilter.includes(item.id));
          // this.selectedRoles = obj
          // this.productDialog = true;
          this.loading = false;
        }
      });
  }




  initLogin() {
    this.psdUpdateForm = this.formBuilder.group({
      current: ['', [Validators.required]],
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
    });
  }
  get f() {
    return this.psdUpdateForm.controls;
  }

  register(form) {
    this.psdSubmitted = true;
    if (this.psdUpdateForm.invalid) {
      return;
    } else {
      const input_data = {
        userId: this.user.userId,
        newPassword: form.password,
        oldPassword: form.current,
      };

      this.isBtnDisabled = true;
      this.userService.updatePswd(input_data).subscribe(
        (res: Response) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.psdUpdateForm.reset();
            this.psdSubmitted = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: res.message,
              life: 3000,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: res.message,
              life: 3000,
            });
          }
          this.isBtnDisabled = false;
        },
        (error) => {
          this.isBtnDisabled = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Oops something went wrong',
            life: 3000,
          });
        }
      );
    }
  }

  password() {
    this.show = !this.show;
  }

  saveProduct() {
    this.submitted = true;
    if (
      this.editableObject.firstName.trim() &&
      this.editableObject.lastName.trim()
    ) {
      this.itemLoading = true;
      if (this.editableObject.id) {
        // if (this.selectedRoles) {
        //   let role = [];
        //   this.selectedRoles.forEach(rl => {
        //     role.push({ userId: this.editableObject.id, roleId: rl.id })
        //   })
        //   this.editableObject.roles = role;
        // }
        this.userService
          .updateUser(this.editableObject, this.editableObject.id)
          .subscribe(
            (response: Response) => {
              if (response.statusCode == 200) {
                this.submitted = false;
                this.itemLoading = false;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'User updated',
                  life: 3000,
                });
              } else if (response.statusCode == 400) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error Message',
                  detail: 'Oops something went wrong',
                  life: 3000,
                });
                this.itemLoading = false;
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error Message',
                  detail: 'Oops something went wrong',
                  life: 3000,
                });
              }
            },
            (error) => {
            }
          );
      }
    }
  }

  activate2Fa(val) {
    const body = {
      userId: this.user.userId,
      isSkipTwoFactAuth: this.isSkipTwoFactAuth,
    };
    this.userService.skipTwoFact(body).subscribe((res: Response) => {
      if (res.statusCode == 200 && res.data == 1) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
        this.set2Fa(this.isSkipTwoFactAuth);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Oops seomthing went wrong',
          life: 3000,
        });
      }
    });
  }

  getProfilePic() {
    let img = this.user.imagePath;
    if (!img) {
      this.imagePath = 'assets/images/user.jpg';
    } else {
      this.imagePath = environment.imgUlr + '/' + img;
    }
  }

  set2Fa(val) {
    this.user.isSkipTwoFactAuth = val;
    const user = this.user;
    const token = this.userService.tokenKey.token;
    let loginResponse = { user: user, token: token };
    this.userService.setToken(loginResponse);
  }

  fileChange(file) {
    this.file = file.target.files[0];
    if (this.file != undefined && this.file != null) {
      var strFileName = this.getFileExtension1(this.file.name);
      if (
        strFileName != 'jpeg' &&
        strFileName != 'png' &&
        strFileName != 'jpg'
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please select correct image format',
          life: 3000,
        });
        return;
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please select image',
        life: 3000,
      });
      return;
    }
    const input_data = {
      // "user_id": this.user.user_id,
      imagePath: this.file == undefined ? '' : this.file,
    };

    const formData = new FormData();
    formData.append('profilePic', input_data.imagePath);
    this.isLoading = true;
    this.userService.uploadProfilePic(formData, this.user.userId).subscribe(
      (res: Response) => {
        if (res.statusCode == 200) {
          this.user.imagePath = res.data['imagePath'];
          this.imagePath = environment.imgUlr + '/' + this.user.imagePath;
          let loginResponse = {
            user: this.user,
            token: this.userService.tokenKey.token,
          };
          this.userService.setToken(loginResponse);
          this.userService.profilePicUpdate.next(true);
          this.fileupload.nativeElement.value = '';
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.message,
            life: 3000,
          });
        } else {
          this.isLoading = false;
          this.fileupload.nativeElement.value = '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Oops something went wrong',
            life: 3000,
          });
        }
      },
      (error) => {
        this.isLoading = false;
        this.fileupload.nativeElement.value = '';
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Oops something went wrong',
          life: 3000,
        });
      }
    );
  }
  getFileExtension1(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
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
