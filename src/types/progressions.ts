import { PaginationQuery } from './common';

export interface ProgressionsListQuery extends PaginationQuery {
  courseId?: string;
  groupId?: string;
  activeAfter?: string;
  activeBefore?: string;
  learnerIds?: string[];
}

export interface Progression {
  id: string;
  learnerId: string;
  courseId: string;
  createdAt: string;
  enrolledAt: string;
  updatedAt: string;
  completedAt: string | null;
  progressPct: number;
  assessmentScore: number | null;
  effectiveAssessmentScore: number | null;
}
