export interface IMailer {
    SendEmail(to: string,  data: any): any;
  }