import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-sales-detail-permission',
  templateUrl: './sales-detail-permission.component.html',
  styleUrls: ['./sales-detail-permission.component.css'],

})
export class SalesDetailPermissionComponent implements OnInit {
  // products: Product[];
  selectedUsers: any;
  selectedRegionalReps = [];
  selectedBrokers = [];
  users: Users[];
  loading: boolean;
  regionalReps: any = [];
  statuses: any[];
  customers: Users[];
  brokerRegReps: {
    brokerName?: string;
    broker?: string;
    regionalRep?: string;
  }[] = [];
  isLoading: boolean;
  brokerWidReps: { regionalRep?: string; brokers?: [{ broker?: string }] }[] =
    [];

  constructor(
    // private productService: ProductService,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit() {
   
    this.statuses = [
      { label: 'Pending', value: 1 },
      { label: 'Approved', value: 2 },
      { label: 'Locked', value: 3 },
      { label: 'Terminated', value: 4 },
    ]
    this.getAllSalesUser();
  }

 
  show(user: Users) {
    let index = this.customers.findIndex(x => x.userId == user.userId)
    let newVal = {
      firstName: user.firstName, lastName: user.lastName, email: user.email, company: user.comment, comment: user.comment, status: user.status, roles: user.roles
    }
    this.customers.splice(index, 0, newVal)
  }


  getAllSalesUser() {
    this.userService.getSalespermission().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.users = res.data;
        this.users.forEach((us) => {
          us.expanded  = true;
        });
      
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Oops somethine went wrong',
          life: 3000,
        });
      }
    });
  }
  


}
