import { PaginationQuery } from './common';

export type AssessmentStatus =
  | 'processing'
  | 'pending_review'
  | 'passed'
  | 'failed'
  | 'completed';

export type BlockGradeResult = 'passed' | 'failed' | 'half';

export interface BlockOutput {
  type: string;
  value: unknown;
}

export interface BlockAssessmentResult {
  blockId: string;
  blockType: string;
  result: BlockGradeResult;
  score: number;
  adjustedResult?: BlockGradeResult | null;
  adjustedScore?: number | null;
  reviewNote?: string | null;
  outputs: Record<string, BlockOutput>;
}

export interface AssessmentResult {
  id: string;
  learnerId: string;
  courseId: string;
  score: number;
  status: AssessmentStatus;
  startedAt: string;
  completedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  blockResults: BlockAssessmentResult[];
}

export interface AssessmentResultsListQuery extends PaginationQuery {
  courseIds: string[];
  learnerIds?: string[];
  status?: string;
}
