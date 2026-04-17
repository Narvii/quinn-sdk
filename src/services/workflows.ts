import { AxiosInstance } from 'axios';
import {
  type WorkflowCreateInput,
  type WorkflowDetail,
  type WorkflowDraftVersionInput,
  type WorkflowPublishResult,
  type WorkflowRun,
  type WorkflowRunsListQuery,
  type WorkflowRunSummary,
  type WorkflowSummary,
  type WorkflowTrigger,
  type WorkflowUpdateInput,
  type WorkflowValidationResult,
  type WorkflowVersionValidateInput,
  type WorkflowVersion,
  type WorkflowVersionSummary,
} from '../types';
import { type QuinnMutationReceipt } from '../mutations';

export class WorkflowsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void,
    private readonly notifyMutationCommitted?: (
      receipt: QuinnMutationReceipt
    ) => Promise<void>
  ) {}

  async list(): Promise<WorkflowSummary[]> {
    const resp = await this.http.get<{ items: WorkflowSummary[] }>('/workflows');
    return resp.data.items;
  }

  async get(workflowId: string): Promise<WorkflowDetail> {
    const resp = await this.http.get<{ item: WorkflowDetail }>(
      `/workflows/${workflowId}`
    );
    return resp.data.item;
  }

  async create(input: WorkflowCreateInput): Promise<WorkflowDetail> {
    this.assertMutationAllowed('workflows.create');
    const resp = await this.http.post<{ item: WorkflowDetail }>('/workflows', {
      name: input.name,
      description: input.description,
    });
    await this.notifyWorkflowMutation('workflows.create', resp.data.item.id);
    return resp.data.item;
  }

  async update(
    workflowId: string,
    input: WorkflowUpdateInput
  ): Promise<WorkflowDetail> {
    this.assertMutationAllowed('workflows.update');
    const resp = await this.http.put<{ item: WorkflowDetail }>(
      `/workflows/${workflowId}`,
      {
        name: input.name,
        description: input.description,
      }
    );
    await this.notifyWorkflowMutation('workflows.update', workflowId);
    return resp.data.item;
  }

  async archive(workflowId: string): Promise<WorkflowDetail> {
    this.assertMutationAllowed('workflows.archive');
    const resp = await this.http.post<{ item: WorkflowDetail }>(
      `/workflows/${workflowId}/archive`
    );
    await this.notifyWorkflowMutation('workflows.archive', workflowId);
    return resp.data.item;
  }

  async unarchive(workflowId: string): Promise<WorkflowDetail> {
    this.assertMutationAllowed('workflows.unarchive');
    const resp = await this.http.post<{ item: WorkflowDetail }>(
      `/workflows/${workflowId}/unarchive`
    );
    await this.notifyWorkflowMutation('workflows.unarchive', workflowId);
    return resp.data.item;
  }

  async delete(workflowId: string): Promise<WorkflowDetail> {
    this.assertMutationAllowed('workflows.delete');
    const resp = await this.http.delete<{ item: WorkflowDetail }>(
      `/workflows/${workflowId}`
    );
    await this.notifyWorkflowMutation('workflows.delete', workflowId);
    return resp.data.item;
  }

  async listVersions(workflowId: string): Promise<WorkflowVersionSummary[]> {
    const resp = await this.http.get<{ items: WorkflowVersionSummary[] }>(
      `/workflows/${workflowId}/versions`
    );
    return resp.data.items;
  }

  async getVersion(workflowId: string, versionId: string): Promise<WorkflowVersion> {
    const resp = await this.http.get<{ item: WorkflowVersion }>(
      `/workflows/${workflowId}/versions/${versionId}`
    );
    return resp.data.item;
  }

  // Ensures there is a single active editable draft for the workflow.
  async createVersion(workflowId: string): Promise<WorkflowVersion> {
    this.assertMutationAllowed('workflows.createVersion');
    const resp = await this.http.post<{ item: WorkflowVersion }>(
      `/workflows/${workflowId}/versions`,
      {}
    );
    await this.notifyWorkflowVersionMutation(
      'workflows.createVersion',
      resp.data.item.id
    );
    return resp.data.item;
  }

  // Saves a draft patch. Omitted fields are preserved; `triggers: []` clears triggers.
  async saveDraftVersion(
    workflowId: string,
    versionId: string,
    input: WorkflowDraftVersionInput
  ): Promise<WorkflowVersion> {
    const resp = await this.http.put<{ item: WorkflowVersion }>(
      `/workflows/${workflowId}/versions/${versionId}/draft`,
      {
        asl: input.asl,
        bindings: input.bindings,
        authoring: input.authoring,
        triggers: input.triggers,
      }
    );
    await this.notifyWorkflowVersionMutation('workflows.saveDraftVersion', versionId);
    return resp.data.item;
  }

  async deleteVersion(
    workflowId: string,
    versionId: string
  ): Promise<WorkflowVersion> {
    this.assertMutationAllowed('workflows.deleteVersion');
    const resp = await this.http.delete<{ item: WorkflowVersion }>(
      `/workflows/${workflowId}/versions/${versionId}`
    );
    await this.notifyWorkflowVersionMutation('workflows.deleteVersion', versionId);
    return resp.data.item;
  }

  async validateVersion(
    workflowId: string,
    versionId: string,
    input: WorkflowVersionValidateInput
  ): Promise<WorkflowValidationResult> {
    const resp = await this.http.post<{ item: WorkflowValidationResult }>(
      `/workflows/${workflowId}/versions/${versionId}/validate`,
      undefined,
      {
        params: {
          target: input.target,
        },
      }
    );
    return resp.data.item;
  }

  async publishVersion(
    workflowId: string,
    versionId: string
  ): Promise<WorkflowPublishResult> {
    this.assertMutationAllowed('workflows.publishVersion');
    const resp = await this.http.post<{ item: WorkflowPublishResult }>(
      `/workflows/${workflowId}/versions/${versionId}/publish`
    );
    await this.notifyWorkflowVersionMutation(
      'workflows.publishVersion',
      versionId
    );
    return resp.data.item;
  }

  async listTriggers(
    workflowId: string,
    versionId: string
  ): Promise<WorkflowTrigger[]> {
    const resp = await this.http.get<{ items: WorkflowTrigger[] }>(
      `/workflows/${workflowId}/versions/${versionId}/triggers`
    );
    return resp.data.items;
  }

  async listRuns(
    workflowId: string,
    query: WorkflowRunsListQuery = {}
  ): Promise<WorkflowRunSummary[]> {
    const resp = await this.http.get<{ items: WorkflowRunSummary[] }>(
      `/workflows/${workflowId}/runs`,
      {
        params: {
          status: query.status,
          limit: query.limit,
        },
      }
    );
    return resp.data.items;
  }

  async getRun(runId: string): Promise<WorkflowRun> {
    const resp = await this.http.get<{ item: WorkflowRun }>(
      `/workflow-runs/${runId}`
    );
    return resp.data.item;
  }

  private async notifyWorkflowMutation(
    operation: string,
    workflowId: string
  ): Promise<void> {
    await this.notifyMutationCommitted?.({
      operation,
      affectedResources: [
        {
          type: 'workflow',
          id: workflowId,
        },
      ],
    });
  }

  private async notifyWorkflowVersionMutation(
    operation: string,
    versionId: string
  ): Promise<void> {
    await this.notifyMutationCommitted?.({
      operation,
      affectedResources: [
        {
          type: 'workflow-version',
          id: versionId,
        },
      ],
    });
  }

}
