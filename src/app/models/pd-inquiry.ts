export class PDInquery {
    id?: any;
    dateRequested?: string ;
    mailSubject?: string = '';
    customer?: any = '';
    project?: any = '';
    needRespondBy?: any ;
    needDate?:any;
    createdby?: any;
    notes?:string = '';
    sentForApproval?: boolean ;
    approvalDate?:any ;
    apDate?:any;
    createdDate?:string ;
    statusNow?:any;
    status?:any = 1;
    attachments?:any[] =[];
    newAttachments?:any[]=[];
    itemNo?:string;
    dimension?:string;
    weight?:string;
}