export type DueDateType = 'fixed' | 'relative';

export interface AssignmentDueConfig {
  type: DueDateType;
  fixedDate?: string;
  timezone?: string;
  relativeDays?: number;
}

export type AssignmentStatus = 'not-started' | 'in-progress' | 'completed';

export type AssignmentSourceType = 'individual' | 'group' | 'program';

export interface AssignmentSource {
  type: AssignmentSourceType;
  assignedAt: string;
  dueDate: string | null;
  assignedByUserId: string | null;
  assignedByName: string | null;
  groupId: string | null;
  groupName: string | null;
  programId: string | null;
  programName: string | null;
}

export interface Assignment {
  userId: string;
  courseId: string;
  assignedAt: string;
  dueDate: string | null;
  status: AssignmentStatus;
  progressPct: number;
  completedAt: string | null;
  assessmentScore: number | null;
  sources: AssignmentSource[];
}

export interface AssignmentsBatchGetInputItem {
  userId: string;
  courseId: string;
}
