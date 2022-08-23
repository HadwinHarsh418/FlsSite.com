export class UserSettings {

      id:number;
      userId:string;
      page:string;
      settingsName:string;
      options:string;
      updatedTime:Date

      constructor(id:number,userId:string,page:string,settingsName:string,options:string,updatedTime:Date)
      {
            this.id = id;
            this.options = options;
            this.page = page;
            this.userId = userId;
            this.settingsName = settingsName;
            this.updatedTime = updatedTime;
      }
}