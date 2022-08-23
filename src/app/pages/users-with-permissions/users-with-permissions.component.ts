import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Response } from 'src/app/models/response';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-users-with-permissions ',
  templateUrl: './users-with-permissions.component.html',
  styleUrls: ['./users-with-permissions.component.css']
})
export class UsersWithPermissionsComponent implements OnInit {
  loading: boolean;
  usWdPrms: any;

  @Input() pageName: string
  showUserDialogue: boolean;

  constructor(
    private itemService: ItemsService,
    private messageService: MessageService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
  }

  getAllUsersWithPermissions() {
    this.loading = true;
    this.itemService.getUsersWithPerms(this.pageName).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.usWdPrms = res.data;
        this.usWdPrms.forEach(us => {
          us.permissions = this.permissionService.mapPemissions(us.permissions)
        });

        this.showUserDialogue = true;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }



  hideDialogueBox() {
    this.showUserDialogue = false
  }


}
