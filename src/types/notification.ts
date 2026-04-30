export type EmailSendResult = {
  status: 'delivered' | 'failed';
  failureReason?: string;
};

export type SmsSendResult = {
  status: 'delivered' | 'failed';
  failureReason?: string;
};

export type EmailSendInput = {
  recipientUserId: string;
  subject?: string;
  markdown: string;
};

export type SmsSendInput = {
  recipientUserId: string;
  body: string;
};
