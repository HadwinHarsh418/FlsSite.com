import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


export class Sale {
  id: number;
  region: string;
  country: string;
  city: string;
  amount: number;
  date: Date;
}

let sales = [
  {

    "brokerID": "GROUPW01",
    "broker": "Group W",
    "custId": "SCH001",
    "customer": "Schorin Company, Inc.",
    "categoryId": "WAT   ",
    "category": "WAVETRENDS",
    "subCat": "WAVETRENDS SQUARE TUMBLERS",
    "itemNumber": "1110",
    "itemNo": "1110",
    "itemDesc": "10 OZ. TUMBLERS",
    "caseQty": "6",
    "salesAmt": 157.38,
    "year": "2019",
    "month": "1",
    "cube": 0.7800,
    "natAccId": "",
    "transType": "1",
    "location": "MW",
    "docNum": "IN165073",
    "poNumber": "1084",
    "yearMonth": "2019-01"
  }, {

    "brokerID": "GROUPW01",
    "broker": "Group W",
    "custId": "SCH001",
    "customer": "Schorin Company, Inc.",
    "categoryId": "WAT   ",
    "category": "rishi",
    "subCat": "WAVETRENDS SQUARE TUMBLERS",
    "itemNumber": "1110",
    "itemNo": "1110",
    "itemDesc": "10 OZ. TUMBLERS",
    "caseQty": "6",
    "salesAmt": 157.38,
    "year": "2019",
    "month": "1",
    "cube": 0.7800,
    "natAccId": "",
    "transType": "1",
    "location": "MW",
    "docNum": "IN165073",
    "poNumber": "1084",
    "yearMonth": "2019-01"
  },


];

@Injectable({
  providedIn: 'root'
})
export class Service {
  apiUrl: string = '';
  constructor(private http: HttpClient) {
    this.apiUrl = environment.url;
  }
  getSales() {

    // return this.http.get(`${environment.url}Fty/GetAllDummyData`);

    return sales;
  }


  getYear(): Observable<any> {
    return this.http.get(`${this.apiUrl}PivotReports/GetReportYears`)
  }

  getPdf(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}PivotReports/ExportSalesDataToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}PivotReports/ExportSalesDataToCsv`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}PivotReports/ExportSalesDataToPdf`, body, { responseType: 'blob' });

  }

  getPdf1(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}SalesOrders/ExportSalesOrdersToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}SalesOrders/ExportSalesOrdersToCsv`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}SalesOrders/ExportSalesOrdersToPdf`, body, { responseType: 'blob' });

  }
  getPdf2(type, body): Observable<any> {
    if (type == 'pdf')

      return this.http.post(`${this.apiUrl}SalesOrders/ExportSalesOrderItemsToPdf`, body, { responseType: 'blob' });

  }
  getPdfExcel(type, ids): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}SalesOrders/ExportSalesOrderItemsToExcel`, ids, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}SalesOrders/ExportSalesOrderItemsToCsv`, ids, { responseType: 'blob' });
  }
  getPdf3(body, type): Observable<any> {
    if (type == 'pdf')

      return this.http.post(`${this.apiUrl}SalesOrders/ExportShipmentItemsToPdf`, body, { responseType: 'blob' });

  }

  getPdfExport(type, body, shipId) {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}SalesOrders/ExportShipmentItemsToExcel?shipId=${shipId}`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}SalesOrders/ExportShipmentItemsToCsv?shipId=${shipId}`, body, { responseType: 'blob' });
  }

  getChargeBackPdf(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportNewReqClaimsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportNewReqClaimsToCSV`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportNewReqClaimsToPDF`, body, { responseType: 'blob' });

  }
  getChargeBackChina(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportChinaClaimsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportChinaClaimsToCSV`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportChinaClaimsToPDF`, body, { responseType: 'blob' });

  }
  getChargeBackFinalApp(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportFinalApprClaimsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportFinalApprClaimsToCSV`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportFinalApprClaimsToPDF`, body, { responseType: 'blob' });

  }
  getChargeBackHistory(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportHistoryClaimsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportHistoryClaimsToCSV`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportHistoryClaimsToPDF`, body, { responseType: 'blob' });

  }
  getChargeBackPdfPopup(type, id): Observable<any> {
    if (type == 'xlsx')
      return this.http.get(`${this.apiUrl}ChargebackClaims/ExportClaimItemsToExcel?id=${id}`, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.get(`${this.apiUrl}ChargebackClaims/ExportClaimItemsToCSV?id=${id}`, { responseType: 'blob' });
    else
      return this.http.get(`${this.apiUrl}ChargebackClaims/ExportClaimItemsToPdf?id=${id}`, { responseType: 'blob' });

  }
  exportPIItemsData(type, id): Observable<any> {
    if (type == 'xlsx')
      return this.http.get(`${this.apiUrl}PriceInquiries/ExportPIItemsToExcel?id=${id}`, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.get(`${this.apiUrl}PriceInquiries/ExportPIItemsToCSV?id=${id}`, { responseType: 'blob' });
    else
      return this.http.get(`${this.apiUrl}PriceInquiries/ExportPIItemsToPdf?id=${id}`, { responseType: 'blob' });

  }


  exportOpenPIFiles(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}PriceInquiries/ExportOpenPIsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}PriceInquiries/ExportOpenPIsToCsv`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}PriceInquiries/ExportOpenPIsToPdf`, body, { responseType: 'blob' });

  }
  exportapprovalFiles(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}PriceInquiries/ExportSFAPIsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}PriceInquiries/ExportSFAPIsToCsv`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}PriceInquiries/ExportSFAPIsToPdf`, body, { responseType: 'blob' });

  }
  exportcompleteFiles(body, type, completedUrl?, dLoadType?): Observable<any> {
    let url = ''
    if (type == 'xlsx') {
      url = completedUrl ? 'ExportApprovedRejectedPIsToExcel' : 'ExportCompletedPIsToExcel'
      return this.http.post(`${this.apiUrl}PriceInquiries/${url}?isApproved=${dLoadType}`, body, { responseType: 'blob' });
    }
    else if (type == 'csv') {
      url = completedUrl ? 'ExportApprovedRejectedPIsToCsv' : 'ExportCompletedPIsToCsv'
      return this.http.post(`${this.apiUrl}PriceInquiries/${url}?isApproved=${dLoadType}`, body, { responseType: 'blob' });
    }
    else {
      url = completedUrl ? 'ExportApprovedRejectedPIsToPdf' : 'ExportCompletedPIsToPdf'
      return this.http.post(`${this.apiUrl}PriceInquiries/${url}?isApproved=${dLoadType}`, body, { responseType: 'blob' });
    }

  }
  archiveFiles(body, type): Observable<any> {
    if (type == 'xlsx')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportArchivedClaimsToExcel`, body, { responseType: 'blob' });
    else if (type == 'csv')
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportArchivedClaimsToCSV`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ChargebackClaims/ExportArchivedClaimsToPDF`, body, { responseType: 'blob' });

  }
}
