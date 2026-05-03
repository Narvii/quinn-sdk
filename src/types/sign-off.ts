import { PaginationQuery } from './common';

export type SignOffInputType = 'string' | 'number' | 'date' | 'boolean';

export type SignOffFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'choice'
  | 'multi_choice'
  | 'dropdown'
  | 'boolean'
  | 'file'
  | 'signature';

export type SignOffFormStatus = 'active' | 'archived';

export type SignOffFormVersionStatus = 'published';

export type SignOffAssignmentStatus = 'pending' | 'completed' | 'cancelled';

export type SignOffSubmissionStatus = 'draft' | 'submitted' | 'rejected';

export interface SignOffInputDef {
  name: string;
  type: SignOffInputType;
  label: string;
}

export interface SignOffFieldDef {
  name: string;
  type: SignOffFieldType;
  label: string;
  required?: boolean;
  options?: string[];
}

export interface SignOffFormVersion {
  id: string;
  formId: string;
  version: number;
  status: SignOffFormVersionStatus;
  publishedAt: string;
  changeNote: string | null;
  htmlS3Path: string;
  htmlUrl: string;
  inputDefs: SignOffInputDef[];
  schema: SignOffFieldDef[];
  createdAt: string;
  updatedAt: string;
}

export interface SignOffMemberSummary {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SignOffGroupSummary {
  id: string;
  name: string;
  creatorUid: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  coursesCount: number;
}

export interface SignOffActor {
  type: string;
  id: string;
  member: SignOffMemberSummary | null;
  group: SignOffGroupSummary | null;
}

export interface SignOffForm {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  creatorId: string | null;
  creator: SignOffMemberSummary | null;
  latestVersionId: string | null;
  status: SignOffFormStatus;
  createdAt: string;
  updatedAt: string;
  latestVersion: SignOffFormVersion | null;
  versions: SignOffFormVersion[];
}

export interface SignOffAssignment {
  id: string;
  formId: string;
  formVersionId: string;
  orgId: string;
  subjectId: string | null;
  subject: SignOffMemberSummary | null;
  actorRef: string;
  actor: SignOffActor | null;
  inputs: Record<string, unknown>;
  assignedBy: string | null;
  dueDate: string | null;
  status: SignOffAssignmentStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface SignOffSubmission {
  id: string;
  assignmentId: string;
  formVersionId: string;
  orgId: string;
  subjectId: string | null;
  subject: SignOffMemberSummary | null;
  submitterId: string;
  submitter: SignOffMemberSummary | null;
  inputs: Record<string, unknown>;
  values: Record<string, unknown>;
  status: SignOffSubmissionStatus;
  createdAt: string;
  updatedAt: string;
  savedAt: string | null;
  submittedAt: string | null;
}

export interface SignOffAssignmentRuntime {
  assignment: SignOffAssignment;
  form: SignOffForm;
  version: SignOffFormVersion;
  draft: SignOffSubmission | null;
}

export interface SignOffAssignmentRollForwardSkip {
  assignmentId: string;
  fromVersionId: string;
  targetVersionId: string;
  reason: string;
}

export interface RollForwardSignOffAssignmentsResult {
  formId: string;
  targetVersionId: string;
  updatedAssignments: SignOffAssignment[];
  skippedAssignments: SignOffAssignmentRollForwardSkip[];
}

export interface SignOffFormsQuery extends PaginationQuery {
  status?: SignOffFormStatus;
}

export interface SignOffAssignmentsQuery extends PaginationQuery {
  formId?: string;
  formVersionId?: string;
  actorRef?: string;
  status?: SignOffAssignmentStatus;
}

export interface SignOffSubmissionsQuery extends PaginationQuery {
  assignmentId?: string;
  status?: SignOffSubmissionStatus;
}

export interface CreateSignOffFormInput {
  name: string;
  description?: string | null;
  initialVersion?: {
    inputDefs: SignOffInputDef[];
    schema: SignOffFieldDef[];
    html: string;
    changeNote?: string | null;
  };
}

export interface UpdateSignOffFormInput {
  name?: string | null;
  description?: string | null;
  status?: SignOffFormStatus;
}

export interface CreateSignOffFormVersionInput {
  inputDefs: SignOffInputDef[];
  schema: SignOffFieldDef[];
  html: string;
  changeNote?: string | null;
}

export interface CreateSignOffAssignmentInput {
  subjectId?: string | null;
  actorRef: string;
  inputs: Record<string, unknown>;
  dueDate?: string | null;
}
