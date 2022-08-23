import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  apiUrl: string = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.url;
  }

  addItem(inputData): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(`${this.apiUrl}items/AddItem`, inputData, { headers: { 'Content-Type': 'multipart' } });
  }
  updateItem(inputData, id): Observable<any> {
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.append('Content-Type', undefined);
    return this.http.put(`${this.apiUrl}items/UpdateItem?id=${id}`, inputData, { headers: { 'Content-Type': 'multipart' } });
  }

  // getAllItems(pageNo, limit, params): Observable<any> {
  //   return this.http.get(`${this.apiUrl}Items/GetAllItems?size=${limit}&page=${pageNo}${params}`);
  // }
  getAllItems(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Items/GetAllItems`, body);
  }
  getChargeBack(body): Observable<any> {
    return this.http.post(`${this.apiUrl}ChargebackClaims/GetChargebackClaims`, body);
  }
  getChinaClaims(body): Observable<any> {
    return this.http.post(`${this.apiUrl}ChargebackClaims/GetChinaClaims`, body);
  }
  getFinalApproval(body): Observable<any> {
    return this.http.post(`${this.apiUrl}ChargebackClaims/GetFinalApprClaims`, body);
  }
  getHistoryClaims(body): Observable<any> {
    return this.http.post(`${this.apiUrl}ChargebackClaims/GetHistoryClaims`, body);
  }
  getArchieve(body):Observable<any>{
    return this.http.post(`${this.apiUrl}ChargebackClaims/GetArchivedClaims`,body)
  }
  badgesfortab():Observable<any>{
    return this.http.get(`${this.apiUrl}ChargebackClaims/GetCBTabsStats`)
  }
  sentApproval(id, isApp): Observable<any> {
    return this.http.get(`${this.apiUrl}PriceInqueries/SetPiProjectApproval?id=${id}&isApproved=${isApp}`)
  }
  getClaims(id): Observable<any> {
    return this.http.get(`${this.apiUrl}ChargebackClaims/GetChargebackWithItems?id=${id}`)
  }

  getPrice(id): Observable<any> {
    return this.http.get(`${this.apiUrl}PriceInquiries/GetPIWithDetails?id=${id}`)
  }
  deleteItem(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}items/DeleteItem?id=${id}`,)
  }

  downloadExcel(type): Observable<any> {
    if (type == 'Excel')
      return this.http.get(`${this.apiUrl}items/ExportItemsToExcel`, { responseType: 'blob' });
    else if (type == 'PDF')
      return this.http.get(`${this.apiUrl}items/ExportItemsToPDF`, { responseType: 'blob' });
    else
      return this.http.get(`${this.apiUrl}items/ExportItemsToCSV`, { responseType: 'text' });
  }
   sampleFile(type): Observable<any> {
    if (type == 'Excel')
      return this.http.get(`${this.apiUrl}items/ExportItemsToExcel`, { responseType: 'blob' });
    else
      return this.http.get(`${this.apiUrl}items/ExportItemsToCSV`, { responseType: 'text' });
  }

  uploadItemsImagesFromZip(formData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(`${this.apiUrl}Items/UploadItemsImagesFromZip`, formData, { headers: { 'Content-Type': 'multipart' } })
  }

  uploadExcel(formData, type): Observable<any> {
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.append('Content-Type', undefined);
    if (type == 'clp')
      return this.http.post(`${this.apiUrl}Clp/ImportClpData`, formData, { headers: { 'Content-Type': 'multipart' } })
    else if (type == 'category')
      return this.http.post(`${this.apiUrl}Category/ImportCategoriesData`, formData, { headers: { 'Content-Type': 'multipart' } })
    else if (type == 'fty')
      return this.http.post(`${this.apiUrl}Fty/ImportFtyData`, formData, { headers: { 'Content-Type': 'multipart' } })
    else if (type == 'sales')
      return this.http.post(`${this.apiUrl}PivotReports/ImportSalesReportData`, formData, { headers: { 'Content-Type': 'multipart' } })
    else if (type == 'ClpInfo')
      return this.http.post(`${this.apiUrl}Clp/ImportClpInfoData`, formData, { headers: { 'Content-Type': 'multipart' } })
    else
      return this.http.post(`${this.apiUrl}items/ImportItemsData`, formData, { headers: { 'Content-Type': 'multipart' } })

  }


  getItemById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}Items/GetItemById?itemId=${id}`);
  }


  getCustomersLarge() {
    return this.http.get<any>('assets/customers-large.json')
      .toPromise()
      .then(res => <Customer[]>res.data)
      .then(data => { return data; });
  }

  getAllPlainFty(): Observable<any> {
    return this.http.get(`${this.apiUrl}Fty/GetAllFtys`);
  }
  getAllLogHistory(body): Observable<any> {
    return this.http.get(`${this.apiUrl}ChargebackClaims/GetChargebackHS?fk=${body}`);
  }
  getAllFty(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Fty/GetAllFtys`, body);
  }
  // getAllSalesDetails(body): Observable<any> {
  //   return this.http.post(`${this.apiUrl}PivotReports/GetSalesReportData`,body);
  // }


  getAllFtyWithNotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}Fty/GetAllFtysWithNotes`);
  }
  addFTY(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Fty/AddFty`, body);
  }
  updateFTY(body): Observable<any> {
    return this.http.put(`${this.apiUrl}Fty/UpdateFty?ftyId=${body.id}`, body);
  }
  getFtyById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}Fty/GetFtyById?ftyId=${id}`);
  }

  deleteFty(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}Fty/DeleteFty?ftyId=${id}`)
  }
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}Category/GetAllCategories`);
  }
  deleteCategory(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}Category/DeleteCategory?categoryId=${id}`)
  }
  addCategory(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Category/AddCategory`, body);
  }
  updateCategory(body): Observable<any> {
    return this.http.put(`${this.apiUrl}Category/UpdateCategory?categoryId=${body.id}`, body);
  }
  getCategoryById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}Category/GetCategoryById?categoryId=${id}`);
  }
  downloadSampleExcel(userId, selectedType?): Observable<any> {
    if (selectedType == 'XLSX')
      return this.http.get(`${this.apiUrl}Items/GetExcelSampleForDataImport?userId=${userId}`, { responseType: 'blob' });
    else
      return this.http.get(`${this.apiUrl}Items/GetCSVSampleForDataImport?userId=${userId}`, { responseType: 'blob' });

  }
  downloadSampleExcel2(selectedType?): Observable<any> {
    if (selectedType == 'XLSX')
      return this.http.get(`${this.apiUrl}Items/GetExcelSampleForDataImport`, { responseType: 'blob' });
    else
      return this.http.get(`${this.apiUrl}Items/GetCSVSampleForDataImport`, { responseType: 'blob' });

  }

  getItemImegById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}Items/GetItemImagesById?itemId=${id}`);
  }

  getAllLogs(body): Observable<any> {
    return this.http.post(`${this.apiUrl}UserOperationsLog/GetAllUserOpsLogs`, body);
  }
  saveFTYNote(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Fty/SaveFtyNote`, body);
  }

  getFtyNote(ftId): Observable<any> {
    return this.http.get(`${this.apiUrl}Fty/GetFtyNotesById?ftyId=${ftId}`);
  }
  getUsersWithPerms(pageName): Observable<any> {
    return this.http.get(`${this.apiUrl}Account/GetUsersAndPermissionsByPageName?pageName=${pageName}`);
  }

  getAllAccessLogs(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Account/GetApiAccessLogs`, body);
  }

  getConvertedFilesToPdf(data, type): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(`${this.apiUrl}PdfOps/GetConvertedFilesToPdf_Spire?conversionType=${type}`, data, { headers: { 'Content-Type': 'multipart' }, responseType: 'blob' });
  }

  getConvertedFilesFromPdf(data, type): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(`${this.apiUrl}PdfOps/GetConvertedFilesFromPdf_Spire?conversionType=${type}`, data, { headers: { 'Content-Type': 'multipart' }, responseType: 'blob' });
  }

  getnewFile(data, type, saveas = false): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    if (type == 'merge') {
      return this.http.post(`${this.apiUrl}PdfOps/GetMergedPdfLink`, data, { headers: { 'Content-Type': 'multipart' } });
      // return this.http.post(`${this.apiUrl}PdfOps/MergePdfsWithITextSharp`, data, { headers: { 'Content-Type': 'multipart' }, responseType: 'blob' },);
    }
    else if (type == 'direct') {
      return this.http.post(`${this.apiUrl}PdfOps/GetMergedPdfFile`, data, { headers: { 'Content-Type': 'multipart' }, responseType: 'blob' },);
    }
    else if (type == 'auto-split') {
      if (saveas) {
        return this.http.post(`${this.apiUrl}PdfOps/GetShipmentsSplitPdfLink`, data, { headers: { 'Content-Type': 'multipart' } });
      } else {
        return this.http.post(`${this.apiUrl}PdfOps/GetShipmentsSplitPdfFiles`, data, { headers: { 'Content-Type': 'multipart' }, responseType: 'blob' },);
      }
    } else {
      // GetManualSplitPdf
      if (saveas) {
        return this.http.post(`${this.apiUrl}PdfOps/GetManualSplitPdfLink`, data, { headers: { 'Content-Type': 'multipart' } });
      } else {
        return this.http.post(`${this.apiUrl}PdfOps/GetManualSplitPdfFile`, data, { headers: { 'Content-Type': 'multipart' }, responseType: 'blob' },);
      }
    }
  }

  getAllpriceInqueries(body): Observable<any> {
    return this.http.post(`${this.apiUrl}PriceInquiries/GetOpenPriceInquiries`, body);
  }
  getAllApproval(body): Observable<any> {
    return this.http.post(`${this.apiUrl}PriceInquiries/GetApprovedPriceInquiries`, body);
  }
  getAllCompleted(body, type): Observable<any> {
    return this.http.post(`${this.apiUrl}PriceInquiries/GetApprovedRejectedPIs?isApproved=${type}`, body);
  }
  getPiProjectPopUpInfoByPiId(id): Observable<any> {
    return this.http.get(`${this.apiUrl}PriceInqueries/GetPiProjectPopUpInfoByPiId?piId=${id}`,);
  }
  addProjectPopUpInfo(body): Observable<any> {
    return this.http.post(`${this.apiUrl}PriceInqueries/AddProjectPopUpInfo`, body, { headers: { 'Content-Type': 'multipart' } });
  }

  SavePiAttachments(body, id): Observable<any> {
    return this.http.post(`${this.apiUrl}PriceInqueries/SavePiAttachments?id=${id}`, body, { headers: { 'Content-Type': 'multipart' } });
  }

  deletePriceInquiry(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}PriceInqueries/DeletePriceInqueries/${id}`)
  }
  deleteAttachmentPrice(attachmentName): Observable<any> {
    return this.http.delete(`${this.apiUrl}PriceInqueries/DeleteAttachment?attachmentName=${attachmentName}`)
  }
  deleteAttachmentPriceInq(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}PriceInquiries/DeletePIAttachment?id=${id}`)
  }
  addPriceInquiry(body): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(`${this.apiUrl}PriceInquiries/SavePriceInquiry`, body, { headers: { 'Content-Type': 'multipart' } });
  }
  updatePriceInquiry(body, id): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.put(`${this.apiUrl}PriceInqueries/UpdatePriceInqueries?priceId=${id}`, body, { headers: { 'Content-Type': 'multipart' } });
  }
  getPriceInquiryById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}PriceInqueries/GetPriceInqueriesById?id=${id}`);
  }

  getAllPDInqueries(body): Observable<any> {
    return this.http.post(`${this.apiUrl}PDInqueries/GetPDInqueries`, body);
  }
  getPdProjectPopUpInfoByPiId(id): Observable<any> {
    return this.http.get(`${this.apiUrl}PDInqueries/GetPdProjectPopUpInfoByPdId?pdId=${id}`,);
  }
  addPDProjectPopUpInfo(body): Observable<any> {
    return this.http.post(`${this.apiUrl}PDInqueries/AddPdProjectPopUpInfo`, body, { headers: { 'Content-Type': 'multipart' } });
  }
  deletePDInquiry(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}PDInqueries/DeletePDInqueries/${id}`)
  }

  deletePriceInquiryPop(id) {
    return this.http.delete(`${this.apiUrl}PriceInqueries/DeletePiProjectPopUpInfoById?piPopupInfoId=${id}`)
  }

  deletePdInquery(id) {
    return this.http.delete(`${this.apiUrl}PDInqueries/DeletePdiProjectPopUpInfoById?pdiPopupInfoId=${id}`)
  }
  deletClaimsRow(id) {
    return this.http.delete(`${this.apiUrl}ChargebackClaims/DeleteChargebackItem?id=${id}`)
  }
  deletepriceInqRow(id) {
    return this.http.delete(`${this.apiUrl}PriceInquiries/DeletePIItem?id=${id}`)
  }
  deletClaimsPopUp(id) {
    return this.http.delete(`${this.apiUrl}ChargebackClaims/DeleteChargebackClaim?id=${id}`)
  }
  deletePriceInPopup(id) {
    return this.http.delete(`${this.apiUrl}PriceInquiries/DeletePriceInquiry?id=${id}`)
  }
  SavePdAttachments(body, id): Observable<any> {
    return this.http.post(`${this.apiUrl}PDInqueries/SavePdAttachments?id=${id}`, body, { headers: { 'Content-Type': 'multipart' } });
  }

  deleteAttachmentPD(attachmentName): Observable<any> {
    return this.http.delete(`${this.apiUrl}PDInqueries/DeleteAttachment?attachmentName=${attachmentName}`)
  }
  addPDInquiry(body): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(`${this.apiUrl}PDInqueries/AddPDInqueries`, body, { headers: { 'Content-Type': 'multipart' } });
  }
  updatePDInquiry(body, id): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.put(`${this.apiUrl}PDInqueries/UpdatePDInqueries?pdId=${id}`, body, { headers: { 'Content-Type': 'multipart' } });
  }
  getPDInquiryById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}PDInqueries/GetPDInqueriesById?id=${id}`);
  }

  getAllInventories(body, type = 1): Observable<any> {
    let rot = (type == 1) ? 'GetInventoryQueues' : 'GetReviewedIQueues';
    return this.http.post(`${this.apiUrl}InventoryQueue/${rot}`, body);
  }
  getInventoryQueuesById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}InventoryQueue/GetInventoryQueueById?id=${id}`);
  }
  deleteInventoryQueue(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}InventoryQueue/DeleteInventoryQueue?id=${id}`)
  }
  addInventoryQueue(body): Observable<any> {
    return this.http.post(`${this.apiUrl}InventoryQueue/SaveInventoryQueue`, body);
  }
  updateInventoryQueue(body, id): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(`${this.apiUrl}InventoryQueue/SaveInventoryQueue?id=${id}`, body, { headers: { 'Content-Type': 'multipart' } });
  }

  deleteInvQueueItem(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}InventoryQueue/DeleteInvQueueItem?id=${id}`)
  }
  createShipId(body):Observable<any> {
    return this.http.post(`${this.apiUrl}ShipIdTracker/AddShipIdHeader`,body)
  }
  GetShIdTrackerTabsStats():Observable<any> {
    return this.http.get(`${this.apiUrl}ShipIdTracker/GetShIdTrackerTabsStats`)
  }
  getDataShipGridTab1(body, type): Observable<any> {
    let rot = (type == 1) ? 'GetShipIdTabData' :(type == 2) ? 'GetBookingTabData' :(type == 3) ? 'GetOTWTabData' :(type == 4) ? 'GetFtyPaymentTabData':(type == 5) ? 'GetInboundTabData':(type == 6) ? 'GetShipIdHeaders' :'GetHistoryTabData';
    return this.http.post(`${this.apiUrl}ShipIdTracker/${rot}`, body);
  }
  getDataShipGridNewTab1(body,type): Observable<any>{
    let rot = (type == 1) ? 'GetShipIdWithDetail' :(type == 2) ? 'GetBookingsWithDetail' :(type == 3) ? 'GetInTransistWithDetail' :(type == 4) ? 'GetFtyPaymentsWithDetail':(type == 5) ? 'GetInboundsWithDetail':(type == 6) ? 'GetShipIdAllWithDetail' :'GetHistoryWithDetail';
    return this.http.post(`${this.apiUrl}ShipIdTracker/${rot}`, body);
  }
  getClpInfoByShipId(body): Observable<any>{
    return this.http.post(`${this.apiUrl}Clp/GetClpInfoByParams`, body);
  }
  deleteShipId(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}ShipIdTracker/DeleteShipIdHeader?id=${id}`)
  }

  DeleteShipId(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}ShipIdTracker/DeleteShipId?id=${id}`)
  }
  getBookingStatus(body): Observable<any> {
    return this.http.get(`${this.apiUrl}BookingStatus/GetBookingStatusesByTab?tab=${body}`);
  }
  getShipIdCounter():Observable<any>{
    return this.http.get(`${this.apiUrl}ShipIdTracker/GetShipIdCounter`);
  }
  getSaveShipIdCounter(body):Observable<any>{
    return this.http.get(`${this.apiUrl}ShipIdTracker/SaveShipIdCounter?shipId=${body}`);
  }

  downloadExcelCSVShipTabs(endpoint, body) {
    return this.http.post(`${this.apiUrl}${endpoint}`, body, { responseType: 'blob' });
  }
  
  downloadExcelForShipTab1(type,body): Observable<any> {
    if (type = 'xls')
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportShipIdToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportShipIdToCsv`, body, { responseType: 'blob' });
  }
  downloadExcelForShipTab2(type,body): Observable<any> {
    if (type = 'xls')
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportBookingToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportBookingToCsv`, body, { responseType: 'blob' });
  }
  downloadExcelForShipTab6(type,body): Observable<any> {
    if (type = 'xls')
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportShipIdAllToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportShipIdAllToCsv`, body, { responseType: 'blob' });
  }
  
  downloadExcelForShipTab4(type,body): Observable<any> {
    if (type = 'xls')
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportOTWToExcel`, body, { responseType: 'blob' });
    else
      return this.http.post(`${this.apiUrl}ShipIdTracker/ExportOTWToCsv`, body, { responseType: 'blob' });
  }
}