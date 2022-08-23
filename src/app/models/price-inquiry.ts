export class PriceInquery {
  id: string = '';
  dateRequested: string = '';
  mailSubject: string = '';
  customer: string = '';
  projectName: string = '';
  needRespondBy?: any;
  createdBy?:any;
  needDate?: any;
  createdby?: any;
  isSentForAppr: boolean = false;
  isCompleted: boolean = false;
  isSentForApp: boolean = true;
  isCompletedd: boolean = true;
  approvalDate?: string;
  apDate?: any;
  createdDate?: string;
  Createdby?: any;
  status?: any = 1;
  statusNow?: any;
  attachments?: any[] = [];
  newAttachments?: any[] = [];
  items?: PriceInqArr[] = [];
  itemNo: string = '';

  sentForApprovalOn: string = '';
  desc: string = '';
  cPrice: string = '';
  tPrice: string = '';
  notes: string = '';
}

export class PriceInqArr {
  priceId?: string = '';
  id?: any;
  itemNo?: string = '';
  dimension?: string = '';
  weight?: string = '';
  dateReq?: any = '';
  sentDate: any = '';

}
