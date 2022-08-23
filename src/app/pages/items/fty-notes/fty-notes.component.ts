import { Component, enableProdMode, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users';
import { Employee, BatchService, State } from 'src/app/services/batch.service';
import { UserService } from 'src/app/services/user.service';
import DxDataGrid from 'devextreme/ui/data_grid';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { DataManagementService } from 'src/app/services/data-management.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators';
if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-fty-notes',
  templateUrl: './fty-notes.component.html',
  styleUrls: ['./fty-notes.component.css']

})
export class FtyNotesComponent implements OnInit {
  user: Users;
  dataSource = [];

  states: State[];
  startEditAction: string = "dblClick";
  selectTextOnEditStart: boolean = false;
  loading: boolean;
  loadingShortCut: boolean;
  stCode: number = 0;
  seachStr: string;
  private keyUpFxn = new Subject<any>();


  constructor(
    private http: HttpClient,
    private userService: UserService,
    public service: BatchService,
    private messageService: MessageService,
    private dtMmgmtService: DataManagementService

  ) {
    this.states = service.getStates();
    this.user = this.userService.tokenKey.user;
    this.getAllFty();
    this.getShortCutStatus();
  }


  ngOnInit() {
    this.keyUpFxn.pipe(
      debounceTime(500)
    ).subscribe(searchTextValue => {
      if (searchTextValue.trim())
        this.getAllFty(searchTextValue);
    });

  }



  getAllFty(val?) {
    this.loading = true;
    const body = {
      searchVal: val ? val : null
    }
    this.dataSource = [];
    this.service.getFtyNotes(body).subscribe((res) => {
      this.dataSource = res['data'];
      this.loading = false;
    })
  }

  onSaving(e: any) {
    if (e.changes.length) {
      e.promise = this.processBatchRequest(`${environment.url}Fty/SaveFtyNotes`, e.changes, e.component);
    }
  }

  async processBatchRequest(url: string, changes: Array<{}>, component: DxDataGrid): Promise<any> {
    await this.http.post(url, JSON.stringify(changes), {
      withCredentials: true,

    }).toPromise();
    await component.refresh(true);
    component.cancelEditData();
  }


  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-wallet',
      url: "/items-list/fty-notes",
      shortcutName: "FTY Notes",
    }
    this.loadingShortCut = true;
    this.dtMmgmtService.addToFav(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.loadingShortCut = false;
        this.getShortCutStatus();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
      else {
        this.loadingShortCut = false;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
      }
    })

  }

  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('FTY Notes').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }

  search() {
    let stringVal
    stringVal = this.seachStr;
    
    if (!this.seachStr) {
      setTimeout(() => {
        this.getAllFty()
      },500)
    }
    else {
      this.keyUpFxn.next(this.seachStr);
    }
  }

}
