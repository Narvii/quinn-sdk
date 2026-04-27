import { AxiosInstance } from 'axios';
import {
  type EmailSendInput,
  type EmailSendResult,
  type SmsSendInput,
  type SmsSendResult,
} from '../types';

type SendEmailResponse = {
  item: EmailSendResult;
};

type SendSmsResponse = {
  item: SmsSendResult;
};

export class NotificationService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async SendEmail(input: EmailSendInput): Promise<EmailSendResult> {
    this.assertMutationAllowed('notification.SendEmail');
    const resp = await this.http.post<SendEmailResponse>(
      '/notifications/email:send',
      input
    );
    return resp.data.item;
  }

  async SendSms(input: SmsSendInput): Promise<SmsSendResult> {
    this.assertMutationAllowed('notification.SendSms');
    const resp = await this.http.post<SendSmsResponse>(
      '/notifications/sms:send',
      input
    );
    return resp.data.item;
  }
}
