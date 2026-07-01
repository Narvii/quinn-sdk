import { SignOffMemberSummary } from './sign-off';

export type SignOffReviewDecision = 'pending' | 'approved' | 'rejected';

export interface SignOffReviewAttempt {
  id: string;
  formId: string;
  formName: string;
  assignmentId?: string | null;
  learnerUid: string;
  attemptNumber: number;
  userHalfData: Record<string, unknown> | null;
  managerHalfData: Record<string, unknown> | null;
  resolvedReviewerUid?: string | null;
  decision: SignOffReviewDecision;
  rejectionComment?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  learner?: SignOffMemberSummary | null;
  reviewer?: SignOffMemberSummary | null;
}

export interface SignOffReviewAttemptsQuery {
  decision?: SignOffReviewDecision;
  limit?: number;
  token?: string;
}
