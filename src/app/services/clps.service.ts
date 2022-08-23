import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/orders';

@Injectable({
  providedIn: 'root'
})
export class ClpsService {
  apiUrl: string = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.url;
  }


  getAllClps(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Clp/GetAllClps`, body);
  }
  addClps(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Clp/AddClp`, body);
  }
  addAllClp(allClp) {
    return this.http.post(`${this.apiUrl}Clp/SaveClps`, allClp);
  }
  updateClps(body): Observable<any> {
    return this.http.put(`${this.apiUrl}Clp/UpdateClp?clpId=${body.id}`, body);
  }
  getClpsById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}Clp/GetClpById?clpId=${id}`);
  }

  getAllSalesDetails(body): Observable<any> {
    return this.http.post(`${this.apiUrl}PivotReports/GetSalesReportData`,body);
  }

  getAllOrder(body): Observable<any> {
    return this.http.post(`${this.apiUrl}SalesOrders/GetSalesOrders`,body);
  }

ChargeClaim(val,body){
  return this.http.post(`${this.apiUrl}ChargebackClaims/SaveChargebackClaim?isSubmit=${val}`,body);
}

  deleteClps(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}Clp/DeleteClp?clpId=${id}`)
  }

  downloadExcel(body, type): Observable<any> {
    if (type == 'xls')
      return this.http.post(`${this.apiUrl}Clp/ExportClpToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}Clp/ExportClpToCSV`, body, { responseType: 'blob' });

  }
  getPdf(body, type): Observable<any> {
    if (type == 'xls')
      return this.http.post(`${this.apiUrl}Clp/ExportClpToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}Clp/ExportClpToCSV`, body, { responseType: 'blob' });
  }

  getDailyClps(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Clp/GetDailyClpData`, body);
  }

  getAllClpItemFolders(): Observable<any> {
    return this.http.get(`${this.apiUrl}Clp/GetDirNames`);
  }

  saveAndGetExcelclps(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Clp/saveAndGetExcelclps`, body);
  }

  getAllReviewClpItem(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Clp/GetClpItemReviewData`, body);
  }

  getDataByItemId(body, type): Observable<any> {
    if (type == 'po')
      return this.http.post(`${this.apiUrl}Clp/GetClpReviewItemsForPo`, body);
    else
      return this.http.post(`${this.apiUrl}Clp/GetClpReviewItemsForPoIt`, body);

  }

  getAllInfoClps(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Clp/GetClpInfoData`, body);
  }

  downloadFileForClpInfo(body, type): Observable<any> {
    if (type == 'xls')
      return this.http.post(`${this.apiUrl}Clp/ExportClpInfoToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}Clp/ExportClpInfoToCSV`, body, { responseType: 'blob' });

  }
  getAllCLPLocation(): Observable<any> {
    return this.http.get(`${this.apiUrl}Clp/GetClpReviewLocations`);
  }
getOrderdata(orderId): Observable<any>{

  return this.http.get(`${this.apiUrl}SalesOrders/GetSalesOrderDetailsByOrder?orderId=${orderId}`);
}

getOrderdata1(searchOrder): Observable<any>{

  return this.http.get(`${this.apiUrl}SalesOrders/GetShipmentsByOrder?orderNo=${searchOrder}`);
}
getOrderdata2(id): Observable<any>{

  return this.http.get(`${this.apiUrl}SalesOrders/GetShipmentDetailsByOrder?shipId=${id}`);
}


getOrderItems(body){
  return this.http.post(`${this.apiUrl}SalesOrders/GetSalesOrderItems`, body);
}

getShipmentOrder(body){
  return this.http.post(`${this.apiUrl}SalesOrders/GetShipmentItems`, body);
}
}
