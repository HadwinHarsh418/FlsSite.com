import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Response } from 'src/app/models/response';
import { Roles } from 'src/app/models/roles';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.css']
})
export class AssignRolesComponent implements OnInit {
  selectedUser: any = null;
  selectedRole: any = null;
  users: Users[];
  loading: boolean;
  roles: Roles[];
  permissions: any = [];
  cities1: any[] = [];

  cities2: any[] = [];

  city1: any = null;

  city2: any = null;

  constructor(
    private userService: UserService,
    private messageService: MessageService

  ) {
    // this.getAllUsers();
    this.getAllRoles();
    this.getAllPermissions();
  }



  ngOnInit(): void {

  }


  // getAllUsers() {
  //   this.loading = true;
  //   this.userService.getAllUser().subscribe((res: Response) => {
  //     if (res.statusCode == 200) {
  //       this.users = res.data;
  //       this.loading = false;

  //     }
  //     else {
  //       this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
  //     }
  //   })

  // }

  getAllRoles() {
    this.loading = true;
    this.userService.getAllRoles().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.roles = res.data;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }
    })

  }

  getAllPermissions() {
    this.loading = true;
    let data = {
      "statusCode": 200,
      "message": "Permissions records found.",
      "data": [
        {
          "id": 1,
          "permissionDesc": "Insert Item",
          "permissionName": "Add Items"
        },
        {
          "id": 2,
          "permissionDesc": "Update Item",
          "permissionName": "Edit Items"
        },
        {
          "id": 3,
          "permissionDesc": "View Item",
          "permissionName": "View Items"
        },
        {
          "id": 4,
          "permissionDesc": "Delete Item",
          "permissionName": "Delete Items"
        }
      ]
    }
    this.permissions = data.data;
    // this.userService.getAllPermission().subscribe((res: Response) => {
    //   if (res.statusCode == 200) {
    //     this.permissions = res.data;
    //     this.loading = false;
    //   }
    //   else {
    //     this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
    //   }
    // })
  }


  submit() {
    console.warn(this.selectedRole, this.selectedUser)

  }

  check() {
    console.warn(this.cities1)
  }
}

