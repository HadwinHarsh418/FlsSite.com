import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Category } from 'src/app/models/category';
import { Response } from 'src/app/models/response';
import { DataManagementService } from 'src/app/services/data-management.service';
import { ItemsService } from 'src/app/services/items.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PDInquery } from 'src/app/models/PD-inquiry';
import { Page } from 'src/app/models/page';
import { ImagesArr } from 'src/app/models/images';
import { FileUpload } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { ProjectDetialsItem } from 'src/app/models/projectDetialsItem';
import { UserService } from 'src/app/services/user.service';
import { saveAs } from 'file-saver';
import { filter } from '@amcharts/amcharts4/.internal/core/utils/Iterator';


@Component({
  selector: 'app-pd-inquiry',
  templateUrl: './pd-inquiry.component.html',
  styleUrls: ['./pd-inquiry.component.css']
})
export class PdInquiryComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  @ViewChild('projectFileInput') projectFileInput: FileUpload;
  PDInqueries: PDInquery[];
  loading: boolean = true;
  editableObject: PDInquery;
  productDialog: boolean = false;
  submitted: boolean = false;
  itemLoading: boolean;
  actions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    // canUpload: false
  }
  loadingShortCut: boolean;
  stCode: number = 0;

  uploadStatus: {
    totalRows: 0,
    rowsInserted: 0,
    rowsNotInserted: 0
  }
  openExtraCol: boolean;
  hideUploadSec: boolean;
  actionBtn: boolean;
  hide: boolean = false;
  cols: any[] = [];
  page: Page = new Page();
  colLength: number = 0;
  totalRecords: number= 0;

  statusOption = [ { label: 'All', value: 0 },{ label: 'Open', value: 1 }, { label: 'Completed', value: 2}];
  assingablestatusOption = [ { label: 'Open', value: 1 }, { label: 'Completed', value: 2}];
  filterByStatus: any;

  openProject:boolean;
  openAddEditProject:boolean;
  projectItems: ProjectDetialsItem[];
  editableProjectItem: ProjectDetialsItem;
  uploadingAttachments: boolean;
  projectAttachments: any[]= [];
 
  user: any;

  cols1: { hidden: boolean; field: string; header: string; }[];
  projectItem: any;
  itemNo: string;
  gId: any;
  popId: any;
  startFrom: number;
  totalNumber :any;
  Limit =20;
  paging: any;
  
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private itemService: ItemsService,
    private dtMmgmtService: DataManagementService

  ) {
    this.user = this.userService.tokenKey.user;
    this.filterByStatus = this.statusOption[0];
    this.getShortCutStatus();
    this.setPage();
  }

  ngOnInit(): void {
    this.actions = {
      canAdd: this.permissionService.getPermissionStatus(57),
      canEdit: this.permissionService.getPermissionStatus(58),
      canDelete: false //this.permissionService.getPermissionStatus(28),
      // canUpload: this.permissionService.getPermissionStatus(41)

    }
  }
 

 

  getAllPDInqueries(event?:  LazyLoadEvent) {
    this.loading = true;
    let params = '';
    let srD = '';
    let srC = '';
    let ft = {};
    if (event && event.globalFilter) params += '&filter=' + event.globalFilter;
    if (event && event.sortField) {
      srD = (event.sortOrder == 1) ? 'asc' : 'desc';
      srC = event.sortField;
    }
    if (event) {
      if (Object.keys(event.filters).length != 0 && event.filters.constructor === Object) {
        ft = event.filters
      }
    }
    // if (event) {
    //   this.page.pageNumber = event.first / event.rows;
    //   this.page.size = event.rows;

    // }
    // else {
    //   this.page.pageNumber = 0
    //   this.page.size = this.page.size ? this.page.size : 20;
    // }
    const body = {
      size: this.paging.pageSize,
      page: this.paging.pageNumber,
      filter: (event && event.globalFilter) ? event.globalFilter : '',
      sortDir: srD,
      sortCol: srC,
      gridFilters: ft,
      Status: this.filterByStatus ? this.filterByStatus.value : 1
    }
    this.itemService.getAllPDInqueries(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paging.totalPages= res.totalPages;
            this.paging.totalElements = res.totalElements;
            this.paging.pageSize = res.size
        // this.cols = this.columnsHeader()
        // if (!this.cols.length) {
          this.cols = this.columnsHeader();
          this.cols1 = this.columnsHeaders();
          this.colLength = this.cols.length;
        // }
        this.PDInqueries = res.data;
        this.gId=this.PDInqueries
        this.totalRecords = res.totalElements;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })
  }
  columnsHeaders() {
    this.cols1 = [];
    let columns1 = [
      
      { hidden: false, field: 'itemNo', header: 'Item No' },
      { hidden: false, field: 'dimension', header: 'Dimension' },
      { hidden: false, field: 'weight', header: 'Weight' },

    ]
    return columns1;
  }
  columnsHeader() {
    this.cols = [];
    let columns = [
      { hidden: true, field: 'id', header: 'Id' },
      { hidden: false, field: 'dateRequested', header: 'Date Requested', type: 'date', format: `MM/dd/yyyy`, data: true,},
      { hidden: false, field: 'mailSubject', header: 'Email Subject' },
      { hidden: false, field: 'customer', header: 'Customer' },
      { hidden: false, field: 'project', header: 'Project Brief' },
      { hidden: this.filterByStatus.value == 2, field: 'needRespondBy', header: 'Need Response By', type: 'date', format: `MM/dd/yyyy`, data: true,},
      { hidden: this.filterByStatus.value == 1, field: 'notes', header: 'Notes' },
      { hidden: true, field: 'broker', header: 'Broker' },
      // { hidden: false, field: 'status', header: 'Status' },
      { hidden: this.filterByStatus.value == 1, field: 'approvalDate', header: 'Date Responded', type: 'date', format: `MM/dd/yyyy`, data: true,},
      { hidden: !this.actionBtn, field: 'Action', header: 'Action' },
    ]
    return columns;
  }

  updateActionButtons() {
    this.cols = this.columnsHeader()
  }

  deleteProduct(cat: PDInquery) {
    const nameCapitalized = cat.mailSubject;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.itemService.deletePDInquiry(cat.id).subscribe((res: Response) => {
          if (res.statusCode == 200 && res.data == 1) {
            this.getAllPDInqueries();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
          }
          else if (res.statusCode == 200 && res.data == 2) {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
          }
          else {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
          }
        })
      }
    });
  }

  openNew() {
    this.editableObject = new PDInquery();
    this.editableObject.statusNow = this.assingablestatusOption[0];
    this.submitted = false;
    this.productDialog = true;
  }
  editProduct(cat: PDInquery) {
    this.getFtyById(cat);
  }



  getFtyById(cat) {
    this.loading = true;
    this.itemService.getPDInquiryById(cat.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        let o = res.data;
        o.needDate = new Date(res.data.needRespondBy)
        if(o.status) {
          o.statusNow = this.assingablestatusOption.filter(item => item.value == o.status)[0];
        } else {
          o.statusNow = this.assingablestatusOption[0];
        }
        o.attachments.map(item => { item.attachmentPath = `${environment.imgUlr}/${item.attachmentPath}`})
        this.editableObject = o;
        this.productDialog = true;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })


  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.itemLoading = false;
  }

  convertToDate(dt, printDate = false) {
    let date = new Date(dt);
    let d;
    let month;
    let day;
    if (dt) {
      month = '' + (date.getMonth() + 1);
      day = '' + date.getDate();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      if (printDate)
        d = `${month}/${day}/${date.getFullYear()}`;
      else
        d = `${date.getFullYear()}/${month}/${day}`;
    }
    else {
      d = null
    }
    return d
  }

  saveProduct() {
    this.submitted = true;
    if (this.editableObject.mailSubject?.trim() && (this.editableObject.needDate || this.editableObject.needRespondBy)) {
      this.itemLoading = true;
      let data = new FormData();
      data.append('ID', this.editableObject.id ? this.editableObject.id : 0);
      data.append('MailSubject', this.editableObject.mailSubject);
      data.append('Customer', this.editableObject.customer);
      // data.append('SentForApproval', this.editableObject.sentForApproval+'');
      data.append('NeedRespondBy', this.convertToDate(this.editableObject.needDate) || this.editableObject.needRespondBy);
      data.append('Project', this.editableObject.project);
      data.append('Notes', this.editableObject.notes);
      data.append('ItemNo',this.editableObject.itemNo);
      data.append('Dimensions',this.editableObject.dimension);
      data.append('Weight',this.editableObject.weight);
      // data.append('CreatedDate', this.editableObject.createdDate || null);
      // data.append('ApprovalDate', this.editableObject.approvalDate || null);
      data.append('Createdby', this.editableObject.createdby  || null);
      // data.append('DateRequested', this.editableObject.dateRequested || null);
      data.append('Status', this.editableObject.statusNow?.value || this.editableObject.status || 1);
      
        for (let i = 0; i < this.fileInput.files.length; i++) {
          data.append('newAttachments', this.fileInput.files[i]);
        }
      
    

      if (this.editableObject.id) {
        this.itemService.updatePDInquiry(data, this.editableObject.id).subscribe((response: Response) => {
          if (response.statusCode == 200 && response.data == 1) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new PDInquery();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllPDInqueries();
          }
          else if (response.statusCode == 200 && response.data == -1) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
          else if (response.statusCode == 400) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
          }
        }, error => {
        });
      }
      else {
        this.itemService.addPDInquiry(data).subscribe((response: Response) => {
          if (response.statusCode == 200) {
            this.submitted = false;
            this.productDialog = false;
            this.itemLoading = false;
            this.editableObject = new PDInquery();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getAllPDInqueries();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: response.message, life: 3000 });
            this.itemLoading = false;
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
        });
      }
    }
  }




  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-money',
      url: "/items-list/PD-inquiry",
      shortcutName: "PD Inquiry",
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
    this.dtMmgmtService.getSortcutName('PD Inquiry').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    })

  }
  handler(event) {
    this.uploadStatus = event
    if (this.uploadStatus)
      this.openExtraCol = true
    this.getAllPDInqueries();
  }
  hidewarningDialog() {
    this.openExtraCol = false
  }

  deleteImg(obj: any, from=null) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + obj.attachmentName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(from == 'projectAttacment') {
          this.projectAttachments = this.projectAttachments.filter(img => img.attachmentName != obj.attachmentName);
        } else {
          this.editableObject.attachments = this.editableObject.attachments.filter(img => img.id != obj.id);
        }
        this.itemService.deleteAttachmentPD(obj.attachmentName).subscribe(
          res => {
          }
        )
      }
    });
  }

  // projection functions
  hideProjectModal() {
    this.openProject = false;
    this.projectItems = [];
  }

  hideEditProject() {
    this.openAddEditProject = false;
    this.editableProjectItem = null;
    this.submitted = false;
  }

  addTable() {
    const obj = {
      id:'',
      itemNo: '',
      dimension: '',
      weight: '',
      pdInquiryId:this.editableObject.id
    }  
    let b
    let v
  this.projectItems.push(obj)
  v = this.projectItems;
  b = v.filter((l) => !l.id! );

  let edObj = b.filter((b) => b.itemNo != '' )[0];
  if(!edObj){
    return
  }
 
  this.editableProjectItem = edObj;
  

  this.saveProjectDetails();
  }
 
  saveProjectDetails() {
  
    this.submitted = true;
    if(!this.editableProjectItem.itemNo) {
      return;
    }
    let formData = new FormData();
    if(this.editableProjectItem.id) {
      formData.append('id', this.editableProjectItem.id);
    }
    formData.append('weight', this.editableProjectItem.weight ? this.editableProjectItem.weight : '');
    formData.append('dimension', this.editableProjectItem.dimension ? this.editableProjectItem.dimension : '');
    formData.append('itemNo', this.editableProjectItem.itemNo ? this.editableProjectItem.itemNo : '');
    formData.append('pdInquiryId', this.editableProjectItem.pdInquiryId ? this.editableProjectItem.pdInquiryId : '');
    formData.append('piInquiryId', this.editableProjectItem.pdInquiryId ? this.editableProjectItem.pdInquiryId : '');
    if(this.projectFileInput){
      for (let i = 0; i < this.projectFileInput.files.length; i++) {
        formData.append('newAttachments', this.projectFileInput.files[i]);
      }
    }
    // for (let i = 0; i < this.projectFileInput.files.length; i++) {
    //   formData.append('newAttachments', this.projectFileInput.files[i]);
    // }
    
    this.loading = true;
    this.itemService.addPDProjectPopUpInfo(formData).subscribe(
      res => {
        if(res.statusCode == 200) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
          this.getProjectItemsById(this.editableObject);
        } else {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
        }
      }, error => {
        this.loading = false;
      }
    )
  }

  deleteRow(rowData){
    let objId
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      
        objId=this.projectItems.filter(x=> x.id ===rowData.id)[0].id;
   
    this.itemService.deletePdInquery(objId).subscribe(res=>{
      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Data Deleted', life: 3000});
      this.getProjectItemsById(this.editableObject);
     
    })
  }
    });
    }   

  addNewProjectItem() {
    this.submitted = false;
    this.editableProjectItem = new ProjectDetialsItem();
    this.editableProjectItem.pdInquiryId  = this.editableObject.id;
    this.openAddEditProject = true;
  }

  editProject(item: ProjectDetialsItem) {
    this.submitted = false;
    this.editableProjectItem = item;
    this.openAddEditProject = true;
  }
  
  viewProject(cat: PDInquery) {
    this.getProjectItemsById(cat);
  }

  getProjectItemsById(cat) {
    this.loading = true;
    this.editableObject = cat;
    this.itemService.getPdProjectPopUpInfoByPiId(cat.id).subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.projectItems = res.data.projectData;
        
        this.projectAttachments = res.data.attachments;
     
        this.openAddEditProject = false;
        this.openProject = true;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    }, error=> {
      this.loading = false; 
    })
  }

  attachmentUpload(event)  {
    this.uploadingAttachments = true;
    let formData =  new FormData();
    for (let i = 0; i < event.files.length; i++) {
      formData.append('attachments', event.files[i]);
    }
    this.itemService.SavePdAttachments(formData,this.editableObject.id).subscribe(
      res=> {
        if(res.statusCode == 200) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
          this.fileInput.clear();
          this.getProjectItemsById(this.editableObject)
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
        }
        this.uploadingAttachments = false;
      }, error => {
        this.uploadingAttachments = false;
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops something went wrong', life: 3000 });
      }
    )
  }
  setPage() {
    this.paging = {
      totalElements: 0,
      totalPages: 0,
      pageSize: 25,
      pageNumber: 0,
    }
  }
  pageChanged(e) {
    this.startFrom = null;
    this.startFrom = (e - 1) * this.Limit;
    this.paging.pageNumber = e-1;
    this.getAllPDInqueries();
  }
   pageSizeChanged(e){
    this.paging.pageSize = e;
    this.getAllPDInqueries();
}

}

