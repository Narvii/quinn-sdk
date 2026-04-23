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
  type WorkflowCollection,
  type WorkflowCollectionCreateInput,
  type WorkflowCollectionUpdateInput,
  type WorkflowReview,
  type WorkflowReviewCreateInput,
  type WorkflowReviewUpdateInput,
  type WorkflowReviewComment,
  type WorkflowReviewCommentCreateInput,
  type WorkflowReviewCommentUpdateInput,
  type WorkflowReviewCommentQueryInput,
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

  // --- Collections (Workspaces) ---

  async listCollections(): Promise<WorkflowCollection[]> {
    const resp = await this.http.get<{ collections: WorkflowCollection[] }>(
      '/workflow-collections'
    );
    return resp.data.collections;
  }

  async getCollection(collectionId: string): Promise<WorkflowCollection> {
    const resp = await this.http.get<{ collection: WorkflowCollection }>(
      `/workflow-collections/${collectionId}`
    );
    return resp.data.collection;
  }

  async createCollection(
    input: WorkflowCollectionCreateInput
  ): Promise<WorkflowCollection> {
    this.assertMutationAllowed('workflows.createCollection');
    const resp = await this.http.post<{ collection: WorkflowCollection }>(
      '/workflow-collections',
      input
    );
    await this.notifyCollectionMutation('workflows.createCollection', resp.data.collection.id);
    return resp.data.collection;
  }

  async updateCollection(
    collectionId: string,
    input: WorkflowCollectionUpdateInput
  ): Promise<WorkflowCollection> {
    this.assertMutationAllowed('workflows.updateCollection');
    const resp = await this.http.put<{ collection: WorkflowCollection }>(
      `/workflow-collections/${collectionId}`,
      input
    );
    await this.notifyCollectionMutation('workflows.updateCollection', collectionId);
    return resp.data.collection;
  }

  async deleteCollection(collectionId: string): Promise<void> {
    this.assertMutationAllowed('workflows.deleteCollection');
    await this.http.delete(`/workflow-collections/${collectionId}`);
    await this.notifyCollectionMutation('workflows.deleteCollection', collectionId);
  }

  // --- Reviews (Walkthroughs) ---

  async getReview(reviewId: string): Promise<WorkflowReview> {
    const resp = await this.http.get<{ review: WorkflowReview }>(
      `/workflow-reviews/${reviewId}`
    );
    return resp.data.review;
  }

  async getReviewByTarget(
    targetKind: string,
    targetId: string
  ): Promise<WorkflowReview | null> {
    try {
      const resp = await this.http.get<{ review: WorkflowReview }>(
        `/workflow-reviews/target/${targetKind}/${targetId}`
      );
      return resp.data.review;
    } catch (err: unknown) {
      if (
        err != null &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === 404
      ) {
        return null;
      }
      throw err;
    }
  }

  async createReview(
    input: WorkflowReviewCreateInput
  ): Promise<WorkflowReview> {
    this.assertMutationAllowed('workflows.createReview');
    const resp = await this.http.post<{ review: WorkflowReview }>(
      '/workflow-reviews',
      input
    );
    await this.notifyReviewMutation('workflows.createReview', resp.data.review.id);
    return resp.data.review;
  }

  async updateReview(
    reviewId: string,
    input: WorkflowReviewUpdateInput
  ): Promise<WorkflowReview> {
    this.assertMutationAllowed('workflows.updateReview');
    const resp = await this.http.put<{ review: WorkflowReview }>(
      `/workflow-reviews/${reviewId}`,
      input
    );
    await this.notifyReviewMutation('workflows.updateReview', reviewId);
    return resp.data.review;
  }

  async deleteReview(reviewId: string): Promise<void> {
    this.assertMutationAllowed('workflows.deleteReview');
    await this.http.delete(`/workflow-reviews/${reviewId}`);
    await this.notifyReviewMutation('workflows.deleteReview', reviewId);
  }

  async generateShareToken(reviewId: string): Promise<WorkflowReview> {
    this.assertMutationAllowed('workflows.generateShareToken');
    const resp = await this.http.post<{ review: WorkflowReview }>(
      `/workflow-reviews/${reviewId}/share-token`
    );
    await this.notifyReviewMutation('workflows.generateShareToken', reviewId);
    return resp.data.review;
  }

  async revokeShareToken(reviewId: string): Promise<void> {
    this.assertMutationAllowed('workflows.revokeShareToken');
    await this.http.delete(`/workflow-reviews/${reviewId}/share-token`);
    await this.notifyReviewMutation('workflows.revokeShareToken', reviewId);
  }

  // --- Review Comments ---

  async queryComments(
    workflowId: string,
    query?: WorkflowReviewCommentQueryInput
  ): Promise<WorkflowReviewComment[]> {
    const resp = await this.http.get<{ comments: WorkflowReviewComment[] }>(
      '/workflow-reviews/comments',
      {
        params: {
          workflowId,
          versionId: query?.versionId,
          nodeId: query?.nodeId,
          status: query?.status,
        },
      }
    );
    return resp.data.comments;
  }

  async createComment(
    reviewId: string,
    input: WorkflowReviewCommentCreateInput
  ): Promise<WorkflowReviewComment> {
    this.assertMutationAllowed('workflows.createComment');
    const resp = await this.http.post<{ comment: WorkflowReviewComment }>(
      `/workflow-reviews/${reviewId}/comments`,
      input
    );
    await this.notifyReviewMutation('workflows.createComment', reviewId);
    return resp.data.comment;
  }

  async updateComment(
    reviewId: string,
    commentId: string,
    input: WorkflowReviewCommentUpdateInput
  ): Promise<WorkflowReviewComment> {
    this.assertMutationAllowed('workflows.updateComment');
    const resp = await this.http.put<{ comment: WorkflowReviewComment }>(
      `/workflow-reviews/${reviewId}/comments/${commentId}`,
      input
    );
    await this.notifyReviewMutation('workflows.updateComment', reviewId);
    return resp.data.comment;
  }

  async deleteComment(reviewId: string, commentId: string): Promise<void> {
    this.assertMutationAllowed('workflows.deleteComment');
    await this.http.delete(
      `/workflow-reviews/${reviewId}/comments/${commentId}`
    );
    await this.notifyReviewMutation('workflows.deleteComment', reviewId);
  }

  private async notifyCollectionMutation(
    operation: string,
    collectionId: string
  ): Promise<void> {
    await this.notifyMutationCommitted?.({
      operation,
      affectedResources: [
        {
          type: 'workflow-collection',
          id: collectionId,
        },
      ],
    });
  }

  private async notifyReviewMutation(
    operation: string,
    reviewId: string
  ): Promise<void> {
    await this.notifyMutationCommitted?.({
      operation,
      affectedResources: [
        {
          type: 'workflow-review',
          id: reviewId,
        },
      ],
    });
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
