import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  apiUrl: string = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.url;
  }

  saveMenus(inputData, id): Observable<any> {
    return this.http.put(`${this.apiUrl}items/UpdateUserCols?userId=${id}`, inputData);
  }

  // getAllColumns(id): Observable<any> {
  //   return this.http.get(`${this.apiUrl}items/GetUserVisAndInVisCols?userId=${id}`);
  // }

  saveColumns(inputData): Observable<any> {
    return this.http.post(`${this.apiUrl}ColsManagement/SaveUserCols`, inputData);

  }
  saveDefault(inputData): Observable<any> {
    return this.http.post(`${this.apiUrl}ColsManagement/GetDefaultCols`, inputData);

  }

  addToFav(shortCutDt): Observable<any> {
    return this.http.post(`${this.apiUrl}Shortcuts/SaveUserShortcut`, shortCutDt);

  }
  getAllshortcut(): Observable<any> {
    return this.http.get(`${this.apiUrl}Shortcuts/GetUserShortcuts`);
  }
  getSortcutName(menuName): Observable<any> {
    return this.http.get(`${this.apiUrl}Shortcuts/GetShortcutStatus?shortcutName=${menuName}`);
  }
  deleteShortCut(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}Shortcuts/DeleteUserShortcut?shortcutId=${id}`);
  }


  getFreshData(): Observable<any> {
    return this.http.get(`${this.apiUrl}Clp/LoadClpInfoFile`);
  }
  getFreshSaleData(): Observable<any> {
    return this.http.get(`${this.apiUrl}PivotReports/LoadSalesReportFileData`);
  }
  getRegRepAv(): Observable<any> {
    return this.http.get(`${this.apiUrl}PivotReports/IsRegionalRep`);
  }

}
