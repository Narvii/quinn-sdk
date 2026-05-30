export type AdaptivePathStatus = 'draft' | 'active' | 'archived';

export type AdaptivePathVersionStatus = 'draft' | 'published';

export type AdaptivePathTriggerType =
  | 'course.completed'
  | 'assessment.scored'
  | 'learner.hired'
  | 'time.elapsed';

export type AdaptivePathActionType =
  | 'skip'
  | 'enroll'
  | 'course.test_out'
  | 'notify'
  | 'set_due_date';

export type AdaptivePathConditionType =
  | 'score'
  | 'completion'
  | 'attribute'
  | 'boolean';

export interface TestOutProofTemplate {
  via: 'assessment' | 'manual';
  threshold?: number;
  sourceRef: string;
  recordedBy: string;
}

export interface TestOutProof extends TestOutProofTemplate {
  score?: number;
  recordedAt: string;
}

export interface TimeElapsedReference {
  eventType: string;
  referenceId: string;
}

export interface AdaptivePathTrigger {
  type: AdaptivePathTriggerType;
  courseId?: string;
  courseName?: string;
  elapsedDays?: number;
  reference?: TimeElapsedReference;
}

export interface AdaptivePathCondition {
  type: AdaptivePathConditionType;
  operator?: string;
  scoreValue?: number;
  scoreMin?: number;
  scoreMax?: number;
  courseId?: string;
  courseName?: string;
  withinDays?: number;
  attribute?: string;
  values?: string[];
  logic?: string;
  children?: AdaptivePathCondition[];
}

export interface AdaptivePathAction {
  type: AdaptivePathActionType;
  courseId?: string;
  courseName?: string;
  dueDays?: number;
  notifyType?: 'learner' | 'manager';
  message?: string;
  required?: boolean;
  proof?: TestOutProofTemplate;
}

export interface AdaptivePathAudience {
  roles?: string[];
  groups?: string[];
}

export interface AdaptivePathRule {
  id: string;
  type: string;
  trigger: AdaptivePathTrigger;
  conditions?: AdaptivePathCondition[];
  action: AdaptivePathAction;
  appliesTo?: AdaptivePathAudience | null;
  priority: number;
}

export interface AdaptivePathRuleset {
  version: number;
  rules: AdaptivePathRule[];
}

export interface AdaptivePathVersionSummary {
  id: string;
  versionNumber: number;
  status: AdaptivePathVersionStatus;
  rules: AdaptivePathRuleset;
  publishedAt: string | null;
  changeNote: string | null;
  createdAt: string;
}

export interface AdaptivePathVersion extends AdaptivePathVersionSummary {
  pathId?: string;
}

export interface AdaptivePathSummary {
  id: string;
  name: string;
  description: string | null;
  status: AdaptivePathStatus;
  ruleCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface AdaptivePathDetail {
  id: string;
  name: string;
  description: string | null;
  status: AdaptivePathStatus;
  currentVersionId: string | null;
  versions: AdaptivePathVersionSummary[];
  updatedAt: string;
  createdAt: string;
}

export interface AdaptivePathRuleInput {
  type: string;
  trigger: AdaptivePathTrigger;
  conditions?: AdaptivePathCondition[];
  action: AdaptivePathAction;
  appliesTo?: AdaptivePathAudience | null;
  priority?: number;
}

export type AdaptivePathRuleUpdateInput = Partial<AdaptivePathRuleInput>;

export interface AdaptivePathValidationIssue {
  code: string;
  path: string;
  message: string;
}

export interface AdaptivePathValidationResult {
  valid: boolean;
  issues: AdaptivePathValidationIssue[];
}

export interface AdaptivePathPublishInput {
  changeNote?: string | null;
}

export interface AdaptivePathCreateInput {
  name: string;
  description?: string | null;
}

export interface AdaptivePathUpdateInput {
  name?: string | null;
  description?: string | null;
}

export interface AdaptivePathDecision {
  id: string;
  pathId: string;
  versionId: string;
  learnerUid: string;
  ruleId: string;
  ruleType: string;
  triggerType: string;
  reason: string;
  mutations: Record<string, unknown> | null;
  platformEventId: string | null;
  createdAt: string;
}
