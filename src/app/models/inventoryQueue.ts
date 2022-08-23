export class InventoryQueue  {
    id?: any;  
    createdOn?: string = '';
    oneTimeCont?:string = '';
    seloneTimeCont?:{label:string, value:string} = {label:'', value:''};
    selcustLoc?:{label:string, value:string} = {label:'', value:''};
    customer?: string = '';
    custLoc?: string = '';
    endUser?: string = '';
    items? :InventoryQueueArr[] = [];
    display?:boolean = false;
}


export class InventoryQueueArr  {
    id?: any;
    itemNo?: string = '';
    qty?: string = '';  
    comments?: string = '';
    invQueueId?:string='';
    dimension?:string='';
    weight?:string='';
    
   
}

