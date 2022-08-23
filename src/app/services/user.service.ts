import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { retry } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';
import { AESHelper } from '../helpers/encLogin/aes-helper';
import { Order } from '../models/orders';
import { TokenResponse } from '../models/tokenData';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  base_url: string;
  secureApi: string;
  exchangeUrl: string;
  tokenKey: TokenResponse;
  apiUrl: string;
  public profilePicUpdate = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router, private aesHelper:AESHelper) {
    this.apiUrl = environment.url;
    this.getToken();
  }

  login(data1: any, rsaKey:any): Observable<any> {
    const encJsonUser = this.aesHelper.encrypt(JSON.stringify(data1));
    return this.http.post(`${this.apiUrl}Account/Login`, { data: encJsonUser, aesKey: rsaKey });
  }
  googleVerify(data1: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Account/VerifyGooglePin`, data1);
  }
  googlelogin() {
    return this.http.get(`${this.apiUrl}Account/GoogleAuth`);
  }

  withTokenGooglelogin(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      }),
    };
    return this.http.get(`${this.apiUrl}Account/GoogleAuth`, httpOptions);
  }
  register(data1: any) {
    return this.http.post(`${this.apiUrl}Account/RegisterUser`, data1);
  }
  setToken(loginResponse) {
    localStorage.setItem('token_Key', JSON.stringify(loginResponse));
    this.getToken();
  }

  getToken() {
    let userData = window.localStorage.getItem('token_Key');
    if (userData) {
      this.tokenKey = JSON.parse(userData);
      return this.tokenKey;
    }
  }

  setPermissions(prms) {
    localStorage.setItem('rolPrm', JSON.stringify(prms));
  }

  getPemissions() {
    let prm = window.localStorage.getItem('rolPrm');
    if (prm) {
      let prms = JSON.parse(prm);
      return prms;
    }
  }

  isLogined() {
    return localStorage.getItem('token_Key') != null;
  }

  logout() {
    localStorage.removeItem('token_Key');
    this.router.navigate(['login']);
  }
  forgotPassword(input_data) {
    return this.http.get(
      `${this.apiUrl}Account/ForgotPassword?email=${input_data.email}`
    );
  }
  resetPassword(input_data): Observable<any> {
    return this.http.post(`${this.apiUrl}Account/ResetPassword`, input_data);
  }
  enable2Fa(body): Observable<any> {
    return this.http.get(
      `${this.apiUrl}Account/SetTwoFactAuthForUser?email=${body.email}&isEnable=${body.isEnable}`
    );
  }

  VerifyGooglePin(body, token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      }),
    };
    return this.http.post(
      `${this.apiUrl}Account/VerifyGooglePin`,
      body,
      httpOptions
    );
  }

  twoFactAuthVerifyFromLogin(body) {
    return this.http.post(`${this.apiUrl}Account/VerifyTwoFactAuthCode`, body);
  }

  getAllUser(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Account/GetAllUsers`, body);
  }

  changeUserStatus(user_id, status): Observable<any> {
    return this.http.get(
      `${this.apiUrl}Account/UpdateUserStatus?Id=${user_id}&isEnable=${status}`
    );
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}Account/DeleteUser?userId=${id}`);
  }
  updateUser(body, id): Observable<any> {
    return this.http.post(
      `${this.apiUrl}Account/UpdateUser?userId=${id}`,
      body
    );
  }

  getAllRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}Roles/GetAllRoles`);
  }

  updateRole(body, id): Observable<any> {
    return this.http.put(`${this.apiUrl}Roles/UpdateRole?id=${id}`, body);
  }
  addNewRole(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Roles/AddRole`, body);
  }
  addNewPersmission(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Roles/AddPermissionsToRole`, body);
  }
  deleteRole(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}Roles/DeleteRole?id=${id}`);
  }

  getAllPermission(): Observable<any> {
    return this.http.get(`${this.apiUrl}Roles/GetAllPermissions`);
  }

  getUserById(userId): Observable<any> {
    return this.http.get(
      `${this.apiUrl}Account/GetUserinfoById?userId=${userId}`
    );
  }

  getRoleById(roleId): Observable<any> {
    return this.http.get(
      `${this.apiUrl}Roles/GetAllRolePermissions?roleId=${roleId}`
    );
  }

  updatePswd(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Account/UpdatePassword`, body);
  }
  getAllPersmissionByUserId(userId): Observable<any> {
    return this.http.get(
      `${this.apiUrl}Roles/GetUserRolePermissionsById?userId=${userId}`
    );
  }

  uploadProfilePic(formData, user_id): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this.http.post(
      `${this.apiUrl}Account/UploadProfileImage?userId=${user_id}`,
      formData,
      { headers: { 'Content-Type': 'multipart' } }
    );
  }
  skipTwoFact(body): Observable<any> {
    return this.http.post(`${this.apiUrl}Account/SetSkipTwoFactAuth`, body);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}PivotReports/GetSalesReportUsers`);
  }

  saveSalesPermissions(body, userId): Observable<any> {
    return this.http.put(
      `${this.apiUrl}PivotReports/SaveSalesReportPermissions?userId=${userId}`,
      body
    );
  }

  getBrokers(body): Observable<any> {
    return this.http.post(
      `${this.apiUrl}PivotReports/GetBrokersByRegionalReps`,
      body
    );
  }
  getAllSalesPerm(): Observable<any> {
    return this.http.get(`${this.apiUrl}PivotReports/GetSalesReportUsers`);
  }
  getRegReps(): Observable<any> {
    return this.http.get(`${this.apiUrl}PivotReports/GetRegionalReps`);
  }

  getUsersRepsBroker(userId): Observable<any> {
    return this.http.get(
      `${this.apiUrl}PivotReports/GetSalesRepPermissionsByUser?userId=${userId}`
    );
  }
  sendEmail(body, token): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      }),
    };
    return this.http.post(
      `${this.apiUrl}Account/SendLoginNotification`,
      body,
      httpOptions
    );
  }
  sendsendVerficationEmailEmail(body, token): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      }),
    };
    return this.http.post(
      `${this.apiUrl}Account/SendAuthCode`,
      body,
      httpOptions
    );
  }
  //   googleAuth(body:any): Observable<any>{
  //     return this.http.get(`${this.apiUrl}/api/Account/GoogleAuth` ,body);

  //   }
  // gooleToken(googletoken){
  //   localStorage.setItem('token_Key', JSON.stringify(googletoken));
  //   this.getToken();
  // }

  //  gettToken(){
  //   let userData = window.localStorage.getItem('token_Key');
  //   if (userData) {
  //     this.tokenKey = JSON.parse(userData);
  //     return this.tokenKey
  //  }

  //   }
  
  getSalespermission():Observable<any>{
    return this.http.get(`${this.apiUrl}PivotReports/GetSalesPermissionDetails`);
  }

  getStatusForTwoFa(data, token?:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      }),
    };
    return this.http.get(`${this.apiUrl}Account/SetTwoFactAuthForUser?email=${data.email}&isEnable=true`,httpOptions);
  }
  getDeptList(): Observable<any> {
    return this.http.get(`${this.apiUrl}UserDepartments/GetUserDepartments`);
  }
  deleteDept(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}UserDepartments/DeleteDepartment?id=${id}`);
  }
  addDept(Name):Observable<any>{
    return this.http.get(`${this.apiUrl}UserDepartments/AddDepartment?department=${Name}`);
  }
  editDept(Name,id):Observable<any>{
    return this.http.get(`${this.apiUrl}UserDepartments/UpdateDepartment?department=${Name}&id=${id}`);
  }
 
}
