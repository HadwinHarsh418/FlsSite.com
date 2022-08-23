
export class Users {
    userId?: string;
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    profile_pic?: string;
    imagePath?: string;
    isTwoFactAuth?: string;
    id?: number;
    dob?: string;
    company?: string;
    comment?: string;
    status?: number;
    response?: number;
    loginAttempts?: string;
    roles?: any[] = [];
    roleArray?:any[] =[]; 
    isAdmin?: boolean = false;
    isSkipTwoFactAuth?: boolean;
    fullName?: string;
    dateRegistered?: string;
    isQrSet?:boolean;
    expanded?:boolean;
    loc?:string;
    department?:string;
}

