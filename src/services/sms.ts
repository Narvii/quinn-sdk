import { AxiosInstance } from 'axios';
import { type SmsSendInput, type SmsSendResult } from '../types';

type SendSmsResponse = {
  item: SmsSendResult;
};

export class SmsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async send(input: SmsSendInput): Promise<SmsSendResult> {
    this.assertMutationAllowed('sms.send');
    const resp = await this.http.post<SendSmsResponse>('/sms:send', input);
    return resp.data.item;
  }
}
