import { AxiosInstance } from 'axios';
import { EmailService } from './email';
import { SmsService } from './sms';

export class NotificationsService {
  readonly email: EmailService;
  readonly sms: SmsService;

  constructor(
    http: AxiosInstance,
    assertMutationAllowed: (operation: string) => void
  ) {
    this.email = new EmailService(http, assertMutationAllowed);
    this.sms = new SmsService(http, assertMutationAllowed);
  }
}
