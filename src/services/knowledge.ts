import { AxiosInstance } from 'axios';
import {
  GetDocumentTranscriptResponse,
  KnowledgeDocument,
  KnowledgeDocumentsMoveInput,
  KnowledgeDocumentsListQuery,
  KnowledgeDocumentsUpdateVisibilityInput,
  KnowledgeFolder,
  KnowledgeFoldersCreateInput,
  KnowledgeFoldersListQuery,
  KnowledgeFoldersMoveInput,
  KnowledgeFoldersRenameInput,
  KnowledgeFoldersUpdateVisibilityInput,
  KnowledgeShareEntry,
  KnowledgeShareTarget,
  KnowledgeSharesListQuery,
  KnowledgeSearchHit,
  KnowledgeSearchInput,
  PagedResult,
} from '../types';

export class KnowledgeDocumentsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void,
  ) {}

  async list(
    query: KnowledgeDocumentsListQuery = {}
  ): Promise<PagedResult<KnowledgeDocument>> {
    const resp = await this.http.get<PagedResult<KnowledgeDocument>>(
      '/knowledge/documents',
      { params: query }
    );
    return resp.data;
  }

  async get(id: string): Promise<KnowledgeDocument | null> {
    const resp = await this.http.get<{ item: KnowledgeDocument | null }>(
      `/knowledge/documents/${id}`
    );
    return resp.data.item;
  }

  async getTranscript(id: string): Promise<GetDocumentTranscriptResponse> {
    const resp = await this.http.get<GetDocumentTranscriptResponse>(
      `/knowledge/documents/${id}/transcript`
    );
    return resp.data;
  }

  async move(input: KnowledgeDocumentsMoveInput): Promise<KnowledgeDocument | null> {
    this.assertMutationAllowed('knowledge.documents.move');
    const resp = await this.http.patch<{ item: KnowledgeDocument | null }>(
      `/knowledge/documents/${input.documentId}/folder`,
      { folderId: input.folderId ?? null }
    );
    return resp.data.item;
  }

  async listShares(
    documentId: string,
    query: KnowledgeSharesListQuery = {}
  ): Promise<KnowledgeShareEntry[]> {
    const resp = await this.http.get<{ items: KnowledgeShareEntry[] }>(
      `/knowledge/documents/${documentId}/shares`,
      { params: query }
    );
    return resp.data.items;
  }

  async share(
    documentId: string,
    input: KnowledgeShareTarget
  ): Promise<KnowledgeShareEntry> {
    this.assertMutationAllowed('knowledge.documents.share');
    const resp = await this.http.post<{ item: KnowledgeShareEntry }>(
      `/knowledge/documents/${documentId}/shares`,
      knowledgeShareTargetToPayload(input)
    );
    return resp.data.item;
  }

  async revokeShare(documentId: string, permissionId: string): Promise<void> {
    this.assertMutationAllowed('knowledge.documents.revokeShare');
    await this.http.delete(
      `/knowledge/documents/${documentId}/shares/${permissionId}`
    );
  }

  async updateVisibility(
    input: KnowledgeDocumentsUpdateVisibilityInput
  ): Promise<void> {
    this.assertMutationAllowed('knowledge.documents.updateVisibility');
    await this.http.patch(
      `/knowledge/documents/${input.documentId}/visibility`,
      { visibility: input.visibility }
    );
  }
}

export class KnowledgeFoldersService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void,
  ) {}

  async list(
    query: KnowledgeFoldersListQuery = {}
  ): Promise<KnowledgeFolder[]> {
    const resp = await this.http.get<{ items: KnowledgeFolder[] }>(
      '/knowledge/folders',
      { params: query }
    );
    return resp.data.items;
  }

  async get(id: string): Promise<KnowledgeFolder | null> {
    const resp = await this.http.get<{ item: KnowledgeFolder | null }>(
      `/knowledge/folders/${id}`
    );
    return resp.data.item;
  }

  async create(input: KnowledgeFoldersCreateInput): Promise<KnowledgeFolder> {
    this.assertMutationAllowed('knowledge.folders.create');
    const resp = await this.http.post<{ item: KnowledgeFolder }>(
      '/knowledge/folders',
      {
        name: input.name,
        parentId: input.parentId ?? null,
      }
    );
    return resp.data.item;
  }

  async rename(input: KnowledgeFoldersRenameInput): Promise<KnowledgeFolder | null> {
    this.assertMutationAllowed('knowledge.folders.rename');
    const resp = await this.http.patch<{ item: KnowledgeFolder | null }>(
      `/knowledge/folders/${input.folderId}`,
      { name: input.name }
    );
    return resp.data.item;
  }

  async move(input: KnowledgeFoldersMoveInput): Promise<KnowledgeFolder | null> {
    this.assertMutationAllowed('knowledge.folders.move');
    const resp = await this.http.patch<{ item: KnowledgeFolder | null }>(
      `/knowledge/folders/${input.folderId}/parent`,
      { parentId: input.parentId ?? null }
    );
    return resp.data.item;
  }

  async delete(folderId: string): Promise<void> {
    this.assertMutationAllowed('knowledge.folders.delete');
    await this.http.delete(`/knowledge/folders/${folderId}`);
  }

  async listShares(
    folderId: string,
    query: KnowledgeSharesListQuery = {}
  ): Promise<KnowledgeShareEntry[]> {
    const resp = await this.http.get<{ items: KnowledgeShareEntry[] }>(
      `/knowledge/folders/${folderId}/shares`,
      { params: query }
    );
    return resp.data.items;
  }

  async share(
    folderId: string,
    input: KnowledgeShareTarget
  ): Promise<KnowledgeShareEntry> {
    this.assertMutationAllowed('knowledge.folders.share');
    const resp = await this.http.post<{ item: KnowledgeShareEntry }>(
      `/knowledge/folders/${folderId}/shares`,
      knowledgeShareTargetToPayload(input)
    );
    return resp.data.item;
  }

  async revokeShare(folderId: string, permissionId: string): Promise<void> {
    this.assertMutationAllowed('knowledge.folders.revokeShare');
    await this.http.delete(
      `/knowledge/folders/${folderId}/shares/${permissionId}`
    );
  }

  async updateVisibility(
    input: KnowledgeFoldersUpdateVisibilityInput
  ): Promise<void> {
    this.assertMutationAllowed('knowledge.folders.updateVisibility');
    await this.http.patch(
      `/knowledge/folders/${input.folderId}/visibility`,
      { visibility: input.visibility }
    );
  }
}

export class KnowledgeService {
  readonly documents: KnowledgeDocumentsService;
  readonly folders: KnowledgeFoldersService;

  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void,
  ) {
    this.documents = new KnowledgeDocumentsService(http, assertMutationAllowed);
    this.folders = new KnowledgeFoldersService(http, assertMutationAllowed);
  }

  async search(input: KnowledgeSearchInput): Promise<KnowledgeSearchHit[]> {
    const resp = await this.http.post<{ items: KnowledgeSearchHit[] }>(
      '/knowledge/search',
      input
    );
    return resp.data.items;
  }
}

function knowledgeShareTargetToPayload(input: KnowledgeShareTarget): {
  userId: string | null;
  groupId: string | null;
} {
  if ('userId' in input) {
    return {
      userId: input.userId ?? null,
      groupId: null,
    };
  }

  return {
    userId: null,
    groupId: input.groupId ?? null,
  };
}
