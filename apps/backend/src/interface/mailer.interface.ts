export interface MailPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface IMailer {
  sendMail(payload: MailPayload): Promise<boolean>;
}
