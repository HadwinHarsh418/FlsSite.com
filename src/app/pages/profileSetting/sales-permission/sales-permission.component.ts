import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { Response } from 'src/app/models/response';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sales-permission',
  templateUrl: './sales-permission.component.html',
  styleUrls: ['./sales-permission.component.css']
})
export class SalesPermissionComponent implements OnInit {
  selectedUsers: any;
  selectedRegionalReps = [];
  selectedBrokers = [];
  users: Users[]
  loading: boolean;
  regionalReps: any = [];
  brokerRegReps: { brokerName?: string, broker?: string, regionalRep?: string }[] = []
  isLoading: boolean;
  brokerWidReps: { regionalRep?: string, brokers?: [{ broker?: string }] }[] = [];
 
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient
  ) {




  }

  ngOnInit(): void {
    //this.userService.getProductsWithOrdersSmall().then(data => this.users = data);
    let users = this.http.get(`${environment.url}PivotReports/GetSalesReportUsers`);
    let regionalReps = this.http.get(`${environment.url}PivotReports/GetRegionalReps`);

    // forkJoin([users, regionalReps]).subscribe(results => {
    //   this.users = results[0]['data'];
    //   this.regionalReps = results[1]['data'];
    // });
    this.getAllSalesUser();
  }


  getAllSalesUser() {
    this.userService.getAllSalesPerm().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.users = res.data;
        this.users.forEach(us => {
          us.fullName = us.firstName + ' ' + us.lastName;
        });
        this.getAllRegReps();

      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }
    })
  }
  getAllRegReps() {
    this.userService.getRegReps().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.regionalReps = res.data;
        this.getBroker([]);
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }
    })
  }


  save() {
    let userId = [];
    
    let regionalReps = [];
    let brokers = [];

    this.selectedRegionalReps.forEach(el => {
      regionalReps.push(el)
    })
    this.selectedBrokers.forEach(el => {
      brokers.push({ broker: el.broker })
    })

    if(regionalReps.length == 0 && brokers.length == 0) {
      regionalReps = this.regionalReps;
      this.brokerRegReps.forEach(el => {
        brokers.push({ broker: el.broker })
        
      })
    }
    
    if (!this.selectedUsers) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select User', life: 3000 });
      return
    }
    if (!this.selectedRegionalReps.length && !this.selectedBrokers.length && !regionalReps.length && !brokers.length) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select atleasst one sales rep or broker', life: 3000 });
      return
    }

    let added = [];
    let tosend = [];
   
    // this.selectedRegionalReps.forEach(item => {
    //   added.push(item.regionalRep);
    //   tosend.push({ regionalRep: item.regionalRep, brokers: [] })
    // }
    // )
    // this.selectedBrokers.forEach(item => {
    //   let ins = added.indexOf(item.regionalRep);
    //   if (ins > -1) {
    //     tosend[ins].brokers.push({ broker: item.broker });
    //   } else {
    //     added.push(item.regionalRep);
    //     ins = added.length - 1;
    //     tosend.push({ regionalRep: item.regionalRep, brokers: [{ broker: item.broker }] });
    //   }

    // });

    const body = {
      regionalReps: regionalReps,
      brokers: brokers
    }
    this.isLoading = true;
    this.userService.saveSalesPermissions(body, this.selectedUsers.userId).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this.isLoading = false;

      }
      else {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }

    })

  }



  changeUser() {
    this.selectedBrokers = [];
    this.selectedRegionalReps = [];
    let rr = [];
    let bk = [];
    if (this.selectedUsers) {
      this.userService.getUsersRepsBroker(this.selectedUsers.userId).subscribe((res: Response) => {
        if (res.statusCode == 200) {
          // res.data.forEach(element => {
          //   rr.push({ regionalRep: element.regionalRep })
          //   element.brokers.map(broker => {
          //     bk = bk.concat({ brokerName: element.regionalRep + ' - ' + broker.broker, broker: broker.broker, regionalRep: element.regionalRep })
          //   });
          // });

          this.selectedRegionalReps = res.data['regionalReps'];
          this.brokerRegReps = this.brokerRegReps;
          this.selectedBrokers = res.data['brokers']

        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
        }
      })
    }
    else {
      this.getAllRegReps();
    }

  }


  onChange(event: any) {
    this.brokerRegReps = [];
    this.selectedBrokers = [];
    let selBroker = [];
    // event.value.forEach(ev => {
    //   this.selectedBrokers.forEach(sb => {
    //     if (ev.regionalRep === sb.regionalRep) {
    //       selBroker.push(sb)
    //     }
    //   });
    // });
    // this.selectedBrokers = [];
    // this.selectedBrokers = this.selectedBrokers;
    this.getBroker(event.value)

  }
  getBroker(val) {
    this.brokerRegReps = [];
    this.userService.getBrokers(val).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.brokerWidReps = res.data;
        res.data.map(bk => {
          bk.brokers.map(broker => {
            this.brokerRegReps.push({ broker: broker.broker })
            // this.brokerRegReps.push({ brokerName: bk.regionalRep + ' - ' + broker.broker, broker: broker.broker, regionalRep: bk.regionalRep })
          });
        });
        this.brokerRegReps = [...new Set(this.brokerRegReps)]
        this.selectedBrokers = [...this.selectedBrokers];
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops somethine went wrong', life: 3000 });
      }
    })
  }


}
