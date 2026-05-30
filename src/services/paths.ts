import { AxiosInstance } from 'axios';
import {
  type AdaptivePathCreateInput,
  type AdaptivePathDecision,
  type AdaptivePathDetail,
  type AdaptivePathPublishInput,
  type AdaptivePathRule,
  type AdaptivePathRuleInput,
  type AdaptivePathRuleUpdateInput,
  type AdaptivePathSummary,
  type AdaptivePathUpdateInput,
  type AdaptivePathValidationResult,
  type AdaptivePathVersion,
} from '../types';
import { type QuinnMutationReceipt } from '../mutations';

export class PathsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void,
    private readonly notifyMutationCommitted?: (
      receipt: QuinnMutationReceipt
    ) => Promise<void>
  ) {}

  // --- Path CRUD ---

  async list(): Promise<AdaptivePathSummary[]> {
    const resp = await this.http.get<{ data: AdaptivePathSummary[] }>(
      '/adaptive-paths'
    );
    return resp.data.data;
  }

  async get(pathId: string): Promise<AdaptivePathDetail> {
    const resp = await this.http.get<{ data: AdaptivePathDetail }>(
      `/adaptive-paths/${pathId}`
    );
    return resp.data.data;
  }

  async create(input: AdaptivePathCreateInput): Promise<AdaptivePathDetail> {
    this.assertMutationAllowed('paths.create');
    const resp = await this.http.post<{ data: AdaptivePathDetail }>(
      '/adaptive-paths',
      input
    );
    await this.notifyPathMutation('paths.create', resp.data.data.id);
    return resp.data.data;
  }

  async update(
    pathId: string,
    input: AdaptivePathUpdateInput
  ): Promise<AdaptivePathDetail> {
    this.assertMutationAllowed('paths.update');
    const resp = await this.http.put<{ data: AdaptivePathDetail }>(
      `/adaptive-paths/${pathId}`,
      input
    );
    await this.notifyPathMutation('paths.update', pathId);
    return resp.data.data;
  }

  async archive(pathId: string): Promise<AdaptivePathDetail> {
    this.assertMutationAllowed('paths.archive');
    const resp = await this.http.post<{ data: AdaptivePathDetail }>(
      `/adaptive-paths/${pathId}/archive`
    );
    await this.notifyPathMutation('paths.archive', pathId);
    return resp.data.data;
  }

  // --- Draft Management ---

  async createDraft(pathId: string): Promise<AdaptivePathVersion> {
    this.assertMutationAllowed('paths.createDraft');
    const resp = await this.http.post<{ data: AdaptivePathVersion }>(
      `/adaptive-paths/${pathId}/versions/draft`
    );
    await this.notifyVersionMutation(
      'paths.createDraft',
      resp.data.data.id
    );
    return resp.data.data;
  }

  async getDraft(pathId: string): Promise<AdaptivePathVersion> {
    const resp = await this.http.get<{ data: AdaptivePathVersion }>(
      `/adaptive-paths/${pathId}/versions/draft`
    );
    return resp.data.data;
  }

  // --- Rules ---

  async listRules(
    pathId: string,
    options: { target: 'draft' | 'published' } = { target: 'draft' }
  ): Promise<AdaptivePathRule[]> {
    const resp = await this.http.get<{ data: AdaptivePathRule[] }>(
      `/adaptive-paths/${pathId}/rules`,
      { params: { target: options.target } }
    );
    return resp.data.data;
  }

  async createRule(
    pathId: string,
    rule: AdaptivePathRuleInput
  ): Promise<AdaptivePathVersion> {
    this.assertMutationAllowed('paths.createRule');
    const resp = await this.http.post<{ data: AdaptivePathVersion }>(
      `/adaptive-paths/${pathId}/rules`,
      rule
    );
    await this.notifyRuleMutation('paths.createRule', pathId);
    return resp.data.data;
  }

  async updateRule(
    pathId: string,
    ruleId: string,
    patch: AdaptivePathRuleUpdateInput
  ): Promise<AdaptivePathVersion> {
    this.assertMutationAllowed('paths.updateRule');
    const resp = await this.http.put<{ data: AdaptivePathVersion }>(
      `/adaptive-paths/${pathId}/rules/${ruleId}`,
      patch
    );
    await this.notifyRuleMutation('paths.updateRule', pathId);
    return resp.data.data;
  }

  async deleteRule(
    pathId: string,
    ruleId: string
  ): Promise<AdaptivePathVersion> {
    this.assertMutationAllowed('paths.deleteRule');
    const resp = await this.http.delete<{ data: AdaptivePathVersion }>(
      `/adaptive-paths/${pathId}/rules/${ruleId}`
    );
    await this.notifyRuleMutation('paths.deleteRule', pathId);
    return resp.data.data;
  }

  // --- Validate & Publish ---

  async validateDraft(
    pathId: string
  ): Promise<AdaptivePathValidationResult> {
    const resp = await this.http.post<{ data: AdaptivePathValidationResult }>(
      `/adaptive-paths/${pathId}/validate`
    );
    return resp.data.data;
  }

  async publishRules(
    pathId: string,
    input: AdaptivePathPublishInput = {}
  ): Promise<AdaptivePathVersion> {
    this.assertMutationAllowed('paths.publishRules');
    const resp = await this.http.post<{ data: AdaptivePathVersion }>(
      `/adaptive-paths/${pathId}/publish`,
      input
    );
    await this.notifyVersionMutation(
      'paths.publishRules',
      resp.data.data.id
    );
    return resp.data.data;
  }

  // --- Decisions ---

  async listDecisions(pathId: string): Promise<AdaptivePathDecision[]> {
    const resp = await this.http.get<{ data: AdaptivePathDecision[] }>(
      `/adaptive-paths/${pathId}/decisions`
    );
    return resp.data.data;
  }

  // --- Mutation notification helpers ---

  private async notifyPathMutation(
    operation: string,
    pathId: string
  ): Promise<void> {
    if (!this.notifyMutationCommitted) return;
    await this.notifyMutationCommitted({
      operation,
      affectedResources: [{ type: 'adaptive-path', id: pathId }],
    });
  }

  private async notifyVersionMutation(
    operation: string,
    versionId: string
  ): Promise<void> {
    if (!this.notifyMutationCommitted) return;
    await this.notifyMutationCommitted({
      operation,
      affectedResources: [{ type: 'adaptive-path-version', id: versionId }],
    });
  }

  private async notifyRuleMutation(
    operation: string,
    pathId: string
  ): Promise<void> {
    if (!this.notifyMutationCommitted) return;
    await this.notifyMutationCommitted({
      operation,
      affectedResources: [{ type: 'adaptive-path-rule', id: pathId }],
    });
  }
}
