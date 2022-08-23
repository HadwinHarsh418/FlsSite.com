import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataManagementService } from 'src/app/services/data-management.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from 'src/app/services/user.service';
import { Users } from 'src/app/models/users';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css']
})
export class DataManagementComponent implements OnInit {


  movies = [];
  watched = [];
  isLoading: boolean = false;
  gettingMenus: boolean = false;
  user: Users;

  constructor(
    private dtMmgmtService: DataManagementService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.user = this.userService.tokenKey.user;
    // this.getAllColumns();
  }

  // getAllColumns() {
  //   this.gettingMenus = true;
  //   this.dtMmgmtService.getAllColumns(this.user.userId).subscribe((res) => {
  //     if (res.statusCode == 200) {
  //       this.movies = res['data']['unSelectedCols'];
  //       this.watched = res['data']['selectedCols'];
  //       this.gettingMenus = false;
  //     }
  //   })
  // }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  ngOnInit(): void {


  }

  save() {
    let dt = {
      selectedCols: this.watched,
      unSelectedCols: this.movies,
      // userId: this.user.id
    }
    this.isLoading = true;
    this.dtMmgmtService.saveMenus(dt, this.user.userId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'there should be atleast one column name', life: 3000 });
      }
      this.isLoading = false
    })
  }

}
