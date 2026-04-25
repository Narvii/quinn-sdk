import { AxiosInstance } from 'axios';
import {
  type NotificationResult,
  type NotificationDeliveryInput,
  type SendEmailInput,
  type SendSmsInput,
} from '../types';

type SendNotificationsResponse = {
  items: NotificationResult[];
};

export class NotificationsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async sendEmail(input: SendEmailInput): Promise<NotificationResult> {
    const [result] = await this.send([
      {
        channel: 'email',
        recipient: { email: input.to },
        content: {
          subject: input.subject,
          body: input.markdown,
        },
      },
    ]);
    return result;
  }

  async sendSms(input: SendSmsInput): Promise<NotificationResult> {
    const [result] = await this.send([
      {
        channel: 'sms',
        recipient: { phoneNumber: input.to },
        content: { body: input.body },
      },
    ]);
    return result;
  }

  async send(deliveries: NotificationDeliveryInput[]): Promise<NotificationResult[]> {
    this.assertMutationAllowed('notifications.send');
    const resp = await this.http.post<SendNotificationsResponse>(
      '/notifications:send',
      { deliveries }
    );
    return resp.data.items;
  }
}
