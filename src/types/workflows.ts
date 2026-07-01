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
  code: string;
  path: string;
  message: string;
  severity: 'error' | 'warning';
  blocks: Array<'draft' | 'publish'>;
}

export type WorkflowValidationTarget = 'draft' | 'publish';

export interface WorkflowValidationResult {
  target: WorkflowValidationTarget;
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
  changeNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowSummary {
  id: string;
  orgId: string;
  key: string | null;
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
  changeNote: string | null;
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
  /** Bare subject id (e.g. the "<id>" in "member/<id>"). */
  subjectId: string;
  /** Raw routing ref, e.g. "member/<id>" or "org/<id>". */
  subjectRef: string;
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
  key?: string;
}

export interface WorkflowUpdateInput {
  name?: string | null;
  description?: string | null;
  key?: string | null;
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

export interface WorkflowVersionCreateInput {
  sourceVersionId?: string;
  asl?: WorkflowDocument;
  bindings?: WorkflowBindings;
  authoring?: WorkflowAuthoring | null;
}

export interface WorkflowVersionPublishInput {
  changeNote?: string | null;
}

export interface WorkflowVersionValidateInput {
  target: WorkflowValidationTarget;
}

export interface WorkflowRunsListQuery {
  status?: WorkflowRunStatus;
  limit?: number;
}

// --- Workflow Run Progress (Ops) ---

export type WorkflowInstanceCurrentPositionState =
  | 'running'
  | 'between_nodes'
  | 'reconciling'
  | 'completed'
  | 'failed'
  | 'canceled';

export interface WorkflowOpsEntityRef {
  id: string;
  displayName: string;
  slug?: string | null;
}

export interface WorkflowOpsSubjectRef {
  type: string;
  id: string;
  displayName: string;
  email?: string | null;
}

export interface WorkflowOpsActorRef {
  ref: string;
  type: string;
  id?: string | null;
  displayName: string;
  email?: string | null;
}

export interface WorkflowRunProgress {
  workflowInstanceId: string;
  orgId: string;
  org: WorkflowOpsEntityRef;
  subject: WorkflowOpsSubjectRef;
  workflowId: string;
  workflowName: string;
  workflowVersionId: string;
  workflowVersionNumber: number;
  status: WorkflowRunStatus;
  state: WorkflowInstanceCurrentPositionState;
  currentNodeIds: string[];
  currentTaskIds: string[];
  actorRefs: string[];
  actors: WorkflowOpsActorRef[];
  currentStepLabels: string[];
  lastActivityAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
}

export interface WorkflowRunsFilter {
  status?: WorkflowRunStatus;
  workflowId?: string;
  subjectId?: string;
  since?: string;
  until?: string;
  cursor?: string;
  limit?: number;
}

export type OrgWorkflowRunsQuery = WorkflowRunsFilter;
export type WorkflowRunProgressQuery = WorkflowRunsFilter;

export interface PagedRunResult<T> {
  items: T[];
  nextCursor?: string | null;
}

// --- Workflow Collections (Workspaces) ---

export interface WorkflowCollection {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  reviewId: string | null;
  workflowIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCollectionCreateInput {
  name: string;
  description?: string | null;
  workflowIds: string[];
}

export interface WorkflowCollectionUpdateInput {
  name?: string | null;
  description?: string | null;
  workflowIds?: string[];
}

// --- Workflow Reviews (Walkthroughs) ---

export interface WorkflowReviewScene {
  id: string;
  targetRef: string;
  script: string;
}

export interface WorkflowReview {
  id: string;
  orgId: string;
  targetKind: string;
  targetId: string;
  name: string | null;
  description: string | null;
  shareToken: string | null;
  pinnedVersions: Record<string, string> | null;
  scenes: WorkflowReviewScene[];
  /**
   * Customer-facing labels for the cross-cluster trigger edges in the
   * walkthrough canvas, keyed by triggerId (from the pinned workflow version's
   * `triggers[].id`).
   *
   * Walkthrough-only metadata — does not affect the runtime trigger config.
   */
  triggerLabels: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowReviewCreateInput {
  targetKind: string;
  targetId: string;
  name?: string | null;
  description?: string | null;
}

export interface WorkflowReviewUpdateInput {
  name?: string | null;
  description?: string | null;
  pinnedVersions?: Record<string, string> | null;
  scenes?: WorkflowReviewScene[] | null;
  triggerLabels?: Record<string, string> | null;
}

// --- Workflow Review Comments ---

export type WorkflowReviewCommentStatus = 'open' | 'resolved' | 'dismissed';

export interface WorkflowReviewCommentAuthor {
  uid: string;
  username: string;
  email: string;
}

export interface WorkflowReviewComment {
  id: string;
  workflowReviewId: string;
  userId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  workflowId: string | null;
  nodeId: string | null;
  pinnedVersionId: string | null;
  isOrphaned: boolean;
  status: WorkflowReviewCommentStatus;
  body: string;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  author: WorkflowReviewCommentAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowReviewCommentCreateInput {
  workflowId?: string | null;
  nodeId?: string | null;
  pinnedVersionId?: string | null;
  body: string;
}

export interface WorkflowReviewCommentUpdateInput {
  body?: string | null;
  status?: WorkflowReviewCommentStatus | null;
}

export interface WorkflowReviewCommentQueryInput {
  versionId?: string;
  nodeId?: string;
  status?: WorkflowReviewCommentStatus;
}

// --- Workflow Lookups ---
//
// Org-admin authored, dry-runnable lookups that resolve a subject to one or
// more target refs at workflow runtime. A lookup definition owns a single
// editable draft plus an immutable version history; a draft must record a
// successful preview before it can be activated.

export type WorkflowLookupStatus = 'active' | 'archived';

export type WorkflowLookupVersionStatus = 'draft' | 'active' | 'archived';

/** Free-form JSON contract/config blobs attached to a lookup version. */
export type WorkflowLookupContract = Record<string, unknown>;
export type WorkflowLookupExecutionConfig = Record<string, unknown>;

export interface WorkflowLookupDefinition {
  id: string;
  kind: string;
  key: string;
  status: WorkflowLookupStatus;
  activeVersion: number;
  activeVersionId: string;
  hasDraft: boolean;
}

export interface WorkflowLookupVersion {
  id: string;
  version: number;
  status: WorkflowLookupVersionStatus;
  scriptCode: string;
  scriptHash: string;
  inputContract: WorkflowLookupContract | null;
  outputContract: WorkflowLookupContract | null;
  executionConfig: WorkflowLookupExecutionConfig | null;
  previewOk: boolean;
  lastPreviewOkHash: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowLookupDetail {
  definition: WorkflowLookupDefinition;
  activeVersion: WorkflowLookupVersion | null;
  draftVersion: WorkflowLookupVersion | null;
  versions: WorkflowLookupVersion[];
}

export interface WorkflowLookupCreateInput {
  kind: string;
  key: string;
}

export interface WorkflowLookupSaveDraftInput {
  scriptCode: string;
  inputContract?: WorkflowLookupContract | null;
  outputContract?: WorkflowLookupContract | null;
  executionConfig?: WorkflowLookupExecutionConfig | null;
}

export interface WorkflowLookupPreviewInput {
  subjectId: string;
}

export interface WorkflowLookupActivateInput {
  /**
   * Optional. When omitted the definition's current draft version is
   * activated. Provide to re-activate a specific historical version.
   */
  versionId?: string;
}

export interface WorkflowLookupPreviewResult {
  kind: string;
  matched: boolean | null;
  reason: string;
  targetRef: string | null;
  targetRefs: string[];
  trace: unknown;
}
