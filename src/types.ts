export type Privilege = 'owner' | 'admin' | 'content-creator' | 'member';

export interface PaginationQuery {
  limit?: number;
  token?: string;
}

export interface PagedResult<T> {
  items: T[];
  nextToken: string;
}

export interface Organization {
  id: string;
  name: string;
  brandColor: string;
  logo: {
    mediaId: string;
    url: string;
  } | null;
}

export interface OrganizationDetails {
  organization: Organization | null;
}

export interface OrganizationUpdateInput {
  name?: string;
  logoMediaId?: string;
  brandColor?: string;
}

export interface Member {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  privilege: Privilege;
  managerUid: string | null;
  roleIds: string[];
  groupIds: string[];
  locationId: string | null;
  createdAt: string;
  phoneNumber: string | null;
}

export interface MembersListQuery extends PaginationQuery {
  search?: string;
  privilege?: Privilege | Privilege[];
  managerUid?: string;
  groupId?: string;
  locationId?: string;
  roleId?: string;
}

export interface MembersBatchGetInput {
  ids?: string[];
  emails?: string[];
}

export interface MembersCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  sendInvite?: boolean;
}

export interface MembersUpdatePrivilegeInput {
  memberId: string;
  privilege: Privilege;
}

export interface MembersUpdateRolesInput {
  memberId: string;
  roleIds: string[];
}

export interface MembersUpdateManagerInput {
  memberId: string;
  managerUid: string;
}

export interface MembersUpdateGroupsInput {
  memberId: string;
  groupIds: string[];
}

export interface MembersUpdateLocationInput {
  memberId: string;
  locationId: string | null;
}

export interface MembersUpdateProfileInput {
  memberId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface Location {
  id: string;
  orgId: string;
  label: string;
  membersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationsCreateInput {
  label: string;
}

export interface LocationsUpdateInput {
  locationId: string;
  label: string;
}

export interface Role {
  id: string;
  label: string;
  levelIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RolesListQuery extends PaginationQuery {}

export interface RolesCreateInput {
  label: string;
}

export interface RolesUpdateInput {
  roleId: string;
  label?: string;
}

export interface RoleLevelInput {
  id?: string;
  name: string;
}

export interface RolesUpdateLevelsInput {
  roleId: string;
  levels: RoleLevelInput[];
}

export interface Level {
  id: string;
  roleId: string;
  name: string;
  color: string;
  value: number;
  completeThreshold: number;
  revenueCapacity: number | null;
  compensation: string | null;
  competencyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LevelsListQuery extends PaginationQuery {
  roleId: string;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  creatorUid: string;
  createdAt: string;
  settings?: {
    managerOnlyEndorsement: boolean;
  };
  courseCount: number;
  courseIds: string[];
  levelLinks: CompetencyLevelLink[];
}

export interface CompetencyLevelLink {
  competencyId: string;
  levelId: string;
  levelName: string;
  levelColor: string;
  roleId: string;
  roleName: string;
}

export interface CompetenciesCreateInput {
  name: string;
  description?: string;
  roleId: string;
  levelIds: string[];
  settings?: {
    managerOnlyEndorsement?: boolean;
  };
}

export interface CompetenciesUpdateInput {
  competencyId: string;
  name?: string;
  description?: string;
  roleId?: string;
  levelIds?: string[];
  settings?: {
    managerOnlyEndorsement?: boolean;
  };
}

export interface CompetenciesListQuery extends PaginationQuery {
  roleId?: string;
  levelId?: string;
  search?: string;
}

export interface LearnerCompetencyProgressQuery {
  roleId?: string;
  levelId?: string;
  managerId?: string;
  groupId?: string;
  locationId?: string;
}

export interface LearnerCompetencyProgressResponse {
  learners: LearnerCompetencyProgress[];
}

export interface LearnerCompetencyProgress {
  userId: string;
  user: LearnerSummary | null;
  roleId: string | null;
  levelProgressions: Record<string, LevelProgression>;
  competencyProgressions: Record<string, CompetencyProgression>;
}

export interface LearnerSummary {
  uid: string;
  username: string;
  email: string | null;
}

export interface LevelProgression {
  progress: number;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  unlocked: boolean;
}

export interface CompetencyProgression {
  progress: number;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  endorsedAt: string | null;
  selfAssessment: 'yes' | 'unsure' | 'no' | null;
  selfAssessedAt: string | null;
}

export type CourseType = 'training' | 'assessment' | 'sign-off';

export interface MediaRef {
  mediaId: string;
  url: string;
}

export interface CoursesListQuery extends PaginationQuery {
  search?: string;
}

export interface Course {
  id: string;
  name: string;
  courseType: CourseType | null;
  creatorUid: string;
  learnerCount: number;
  cover: MediaRef | null;
  tagNames: string[];
  containingProgramIds: string[];
  isDraft: boolean;
  createdAt: string;
}

export interface CourseAssignedGroup {
  groupId: string;
  groupName: string;
  membersCount: number;
  assignedBy: string;
  assignedAt: string;
}

export interface CourseAssignedMember {
  userId: string;
  name: string;
  email: string;
  groupNames: string[];
  assignedAt: string;
  dueDate: string | null;
  addedBy: string;
  progressPct: number | null;
  assignedDirectly: boolean;
  assignedViaProgram: boolean;
}

export type DueDateType = 'fixed' | 'relative';

export interface AssignmentDueConfig {
  type: DueDateType;
  fixedDate?: string;
  timezone?: string;
  relativeDays?: number;
}

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

export interface AssignedUser {
  email: string;
  userId: string;
  assigned: boolean;
}

export interface CoursesAssignToUsersInput {
  courseId: string;
  userIds: string[];
  dueDateConfig?: AssignmentDueConfig;
}

export interface CoursesAssignToGroupsInput {
  courseId: string;
  groupIds: string[];
  dueDateConfig?: AssignmentDueConfig;
}

export interface CoursesUnassignFromUserInput {
  courseId: string;
  userId: string;
}

export interface CoursesUnassignFromGroupInput {
  courseId: string;
  groupId: string;
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

export interface KnowledgeSearchInput {
  query: string;
  folderId?: string;
  size?: number;
}

export interface KnowledgeSearchHit {
  id: string;
  type: string;
  text: string;
  documentId?: string | null;
  courseId?: string | null;
  blockId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  uid: string;
  orgId: string;
  parentId: string;
  parentType: string;
  status: string;
  extFileId: string | null;
  contentType: string | null;
  originalContentLength: number;
  contentLength: number;
  downloadable: boolean;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocumentsListQuery extends PaginationQuery {
  folderId?: string;
  name?: string;
  includePackFiles?: boolean;
}

export interface KnowledgeDocumentsMoveInput {
  documentId: string;
  folderId?: string | null;
}

export interface KnowledgeDocumentsUpdateVisibilityInput {
  documentId: string;
  visibility: 'organization' | 'restricted';
}

export interface GetDocumentTranscriptResponse {
  content: string;
}

export interface KnowledgeShareEntry {
  id: string;
  userId?: string | null;
  groupId?: string | null;
  inherited: boolean;
  createdAt: string;
}

export interface KnowledgeSharesListQuery {
  includeInherited?: boolean;
}

export type KnowledgeShareTarget =
  | { userId: string; groupId?: never }
  | { groupId: string; userId?: never };

export interface KnowledgeFolder {
  id: string;
  orgId: string;
  name: string;
  parentId: string | null;
  createdBy: string;
  children?: KnowledgeFolder[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeFoldersListQuery {
  parentId?: string;
}

export interface KnowledgeFoldersCreateInput {
  name: string;
  parentId?: string | null;
}

export interface KnowledgeFoldersRenameInput {
  folderId: string;
  name: string;
}

export interface KnowledgeFoldersMoveInput {
  folderId: string;
  parentId?: string | null;
}

export interface KnowledgeFoldersUpdateVisibilityInput {
  folderId: string;
  visibility: 'organization' | 'restricted';
}

export type GroupKind = 'user-managed' | 'auto-mapped';

export type GroupAutoMapType = 'role' | 'location' | 'manager';

export interface GroupAutoMap {
  type: GroupAutoMapType;
  sourceId: string;
}

export interface Group {
  id: string;
  name: string;
  creatorUid: string;
  kind: GroupKind;
  autoMap: GroupAutoMap | null;
  membersCount: number;
  coursesCount: number;
  createdAt: string;
}

export interface GroupsListQuery extends PaginationQuery {
  kind?: GroupKind | GroupKind[];
}

export interface GroupMember {
  groupId: string;
  userId: string;
  addedByUid: string;
  addedAt: string;
}

export interface GroupsCreateInput {
  name: string;
  userIds?: string[];
}

export interface GroupsCreateResult {
  group: Group;
  assignedUsers: AssignedUser[];
}

export interface GroupsUpdateNameInput {
  groupId: string;
  name: string;
}

export interface GroupsAddMembersInput {
  groupId: string;
  userIds: string[];
}

export interface GroupsRemoveMemberInput {
  groupId: string;
  userId: string;
}

export interface ProgramsListQuery extends PaginationQuery {
  search?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  creatorUid: string;
  courseCount: number;
  learnerCount: number;
  createdAt: string;
}

export interface ProgramsCreateInput {
  name: string;
  courseIds?: string[];
}

export interface Endorsement {
  id: string;
  uid: string;
  competencyId: string;
  roleId: string | null;
  selfAssessment: string | null;
  selfAssessedAt: string | null;
  endorsedAt: string | null;
  endorsedByUid: string | null;
  endorsementSource: string | null;
  resetAt: string | null;
  resetByUid: string | null;
  resetReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListEndorsementsInput {
  uids: string[];
  competencyIds: string[];
}

export interface EndorseCompetencyInput {
  uid: string;
  competencyId: string;
  note?: string;
}

export interface ResetEndorsementInput {
  uid: string;
  competencyId: string;
  reason: string;
}

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
  inputDefs: SignOffInputDef[];
  schema: SignOffFieldDef[];
  html: string;
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
}

export interface CreateSignOffAssignmentInput {
  subjectId?: string | null;
  actorRef: string;
  inputs: Record<string, unknown>;
  dueDate?: string | null;
}

export type WorkflowStatus = 'draft' | 'active' | 'archived';

export type WorkflowVersionStatus =
  | 'draft'
  | 'publishing'
  | 'published'
  | 'publish_failed'
  | 'deprecated';

export type WorkflowRunStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'canceled';

export type WorkflowTaskStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'skipped';

export type WorkflowPredicateOp =
  | 'eq'
  | 'neq'
  | 'exists'
  | 'in'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte';

export type WorkflowDocument = Record<string, unknown>;

export type WorkflowBindings = Record<string, unknown>;

export type WorkflowAuthoring = Record<string, unknown>;

export interface WorkflowCounts {
  versions: number;
  instances: number;
}

export interface WorkflowValidationIssue {
  path: string;
  message: string;
}

export interface WorkflowValidationResult {
  valid: boolean;
  issues: WorkflowValidationIssue[];
  nodeRefs: string[];
}

export interface WorkflowPublishResult {
  workflowId: string;
  versionId: string;
  status: 'published';
  sfnArn: string;
  issues: WorkflowValidationIssue[];
}

export interface WorkflowEventMatchPredicate {
  op: WorkflowPredicateOp;
  path: string;
  value?: unknown;
}

export interface WorkflowEventMatchFilter {
  all?: WorkflowEventMatchPredicate[];
  any?: WorkflowEventMatchPredicate[];
}

export interface WorkflowTrigger {
  id: string;
  customerWorkflowVersionId: string;
  eventType: string;
  filter: WorkflowEventMatchFilter | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowVersionSummary {
  id: string;
  workflowId: string;
  versionNumber: number;
  status: WorkflowVersionStatus;
  sfnArn: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowSummary {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  status: WorkflowStatus;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDetail extends WorkflowSummary {
  currentVersion: WorkflowVersionSummary | null;
  versions: WorkflowVersionSummary[];
  counts: WorkflowCounts;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  versionNumber: number;
  status: WorkflowVersionStatus;
  sfnArn: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  asl: WorkflowDocument;
  bindings: WorkflowBindings;
  authoring: WorkflowAuthoring | null;
  triggers: WorkflowTrigger[];
}

export interface WorkflowSubject {
  id: string;
  name: string;
  email: string;
}

export interface WorkflowActor {
  ref: string;
  type: string;
  id: string;
  name: string;
  email: string | null;
}

export interface WorkflowTask {
  id: string;
  workflowInstanceId: string;
  subjectId: string;
  actorRef: string;
  nodeRef: string;
  mode: string;
  label: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  metadata: Record<string, unknown>;
  completionEventType: string | null;
  completionFilter: Record<string, unknown>;
  status: WorkflowTaskStatus;
  activatedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subject: WorkflowSubject | null;
  actor: WorkflowActor | null;
}

export interface WorkflowRunSummary {
  id: string;
  orgId: string;
  customerWorkflowId: string;
  customerWorkflowVersionId: string;
  subjectId: string;
  status: WorkflowRunStatus;
  engineExecutionId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subject: WorkflowSubject | null;
  tasks: WorkflowTask[];
  version: WorkflowVersionSummary | null;
}

export interface WorkflowRun {
  id: string;
  orgId: string;
  customerWorkflowId: string;
  customerWorkflowVersionId: string;
  subjectId: string;
  status: WorkflowRunStatus;
  engineExecutionId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subject: WorkflowSubject | null;
  tasks: WorkflowTask[];
  version: WorkflowVersion;
  workflow: WorkflowSummary;
  managedSchedules: Array<Record<string, unknown>>;
}

export interface WorkflowCreateInput {
  name: string;
  description?: string | null;
}

export interface WorkflowUpdateInput {
  name?: string | null;
  description?: string | null;
}

export interface WorkflowDraftTriggerInput {
  eventType: string;
  filter?: WorkflowEventMatchFilter | null;
}

export interface WorkflowDraftVersionInput {
  asl?: WorkflowDocument;
  bindings?: WorkflowBindings;
  authoring?: WorkflowAuthoring | null;
  triggers?: WorkflowDraftTriggerInput[];
}

export interface WorkflowRunsListQuery {
  status?: WorkflowRunStatus;
  limit?: number;
}

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
