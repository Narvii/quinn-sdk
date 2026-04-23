import { AxiosInstance } from 'axios';
import { type QuinnMutationReceipt } from '../mutations';
import {
  Automation,
  AutomationRun,
  AutomationRunsListQuery,
  AutomationsCreateInput,
  AutomationsUpdateInput,
} from '../types';

export class AutomationsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void,
    private readonly notifyMutationCommitted?: (
      receipt: QuinnMutationReceipt
    ) => Promise<void>
  ) {}

  async list(): Promise<Automation[]> {
    const resp = await this.http.get<{ items: Automation[] }>('/automations');
    return resp.data.items;
  }

  async get(automationId: string): Promise<Automation> {
    const resp = await this.http.get<{ item: Automation }>(
      `/automations/${automationId}`
    );
    return resp.data.item;
  }

  async create(input: AutomationsCreateInput): Promise<Automation> {
    this.assertMutationAllowed('automations.create');
    const resp = await this.http.post<{ item: Automation }>('/automations', {
      name: input.name,
      instruction: input.instruction,
      trigger: input.trigger,
      isEnabled: input.isEnabled ?? true,
    });
    await this.notifyAutomationMutation(
      'automations.create',
      resp.data.item.id
    );
    return resp.data.item;
  }

  async update(
    automationId: string,
    input: AutomationsUpdateInput
  ): Promise<Automation> {
    this.assertMutationAllowed('automations.update');
    const resp = await this.http.put<{ item: Automation }>(
      `/automations/${automationId}`,
      input
    );
    await this.notifyAutomationMutation('automations.update', automationId);
    return resp.data.item;
  }

  async delete(automationId: string): Promise<void> {
    this.assertMutationAllowed('automations.delete');
    await this.http.delete(`/automations/${automationId}`);
    await this.notifyAutomationMutation('automations.delete', automationId);
  }

  async run(automationId: string): Promise<AutomationRun> {
    this.assertMutationAllowed('automations.run');
    const resp = await this.http.post<{ item: AutomationRun }>(
      `/automations/${automationId}/runs`
    );
    await this.notifyMutationCommitted?.({
      affectedResources: [{ id: resp.data.item.runId, type: 'automation-run' }],
      operation: 'automations.run',
    });
    return resp.data.item;
  }

  async listRuns(
    automationId: string,
    query: AutomationRunsListQuery = {}
  ): Promise<AutomationRun[]> {
    const resp = await this.http.get<{ items: AutomationRun[] }>(
      `/automations/${automationId}/runs`,
      {
        params: {
          limit: query.limit,
        },
      }
    );
    return resp.data.items;
  }

  async getRun(runId: string): Promise<AutomationRun> {
    const resp = await this.http.get<{ item: AutomationRun }>(
      `/automation-runs/${runId}`
    );
    return resp.data.item;
  }

  private async notifyAutomationMutation(
    operation: string,
    automationId: string
  ): Promise<void> {
    await this.notifyMutationCommitted?.({
      affectedResources: [{ id: automationId, type: 'automation' }],
      operation,
    });
  }
}
