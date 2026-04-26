import { AxiosInstance } from 'axios';
import { type EmailSendInput, type EmailSendResult } from '../types';

type SendEmailResponse = {
  item: EmailSendResult;
};

export class EmailService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async send(input: EmailSendInput): Promise<EmailSendResult> {
    this.assertMutationAllowed('notifications.email.send');
    const resp = await this.http.post<SendEmailResponse>(
      '/notifications/email:send',
      input
    );
    return resp.data.item;
  }
}
