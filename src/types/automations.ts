export type AutomationRunStatus = 'queued' | 'running' | 'completed' | 'failed';
export type AutomationRunTriggerKind =
  | 'event'
  | 'cronjob'
  | 'at-time'
  | 'run-now';

export type AutomationTrigger =
  | {
      type: 'cronjob';
      cronjob: {
        expression: string;
        timezone: string;
      };
    }
  | {
      type: 'at-time';
      atTime: {
        datetime: string;
        timezone: string;
      };
    }
  | {
      type: 'event-driven';
      event: {
        type: string;
        delayedMinutes?: number;
      };
    };

export interface Automation {
  id: string;
  orgId: string;
  isEnabled: boolean;
  source: 'custom';
  name: string | null;
  trigger: AutomationTrigger;
  templateKey: string | null;
  variables?: Record<string, unknown> | null;
  description: string | null;
  instruction: string | null;
  campaignId: string | null;
  files?: AutomationFile[];
  template?: unknown | null;
  creatorUid: string;
  lastModifiedByUid: string;
  createdAt: string;
  updatedAt: string;
  creator?: unknown | null;
  campaign?: unknown | null;
}

export interface AutomationFile {
  path: string;
  mime: string;
  size: number;
  sha256: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface AutomationFileUploadInput {
  path: string;
  contentBase64: string;
  mime?: string;
}

export interface AutomationRun {
  runId: string;
  automationId: string;
  orgId: string;
  source: 'custom';
  triggeredAt: string;
  completedAt?: string | null;
  triggerKind: AutomationRunTriggerKind;
  status: AutomationRunStatus;
  sessionId?: string | null;
  sandboxStatus?: string | null;
  lastActiveAt?: string | null;
  errorInfo?: Record<string, unknown> | null;
}

export interface AutomationsListQuery {
  limit?: number;
}

export interface AutomationsCreateInput {
  name: string;
  description?: string;
  instruction: string;
  trigger: AutomationTrigger;
  isEnabled?: boolean;
  files?: AutomationFileUploadInput[];
}

export interface AutomationsUpdateInput {
  name?: string;
  description?: string;
  instruction?: string;
  trigger?: AutomationTrigger;
  isEnabled?: boolean;
}

export interface AutomationRunsListQuery {
  limit?: number;
}
