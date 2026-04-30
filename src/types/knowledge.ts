import { PaginationQuery } from './common';

export interface KnowledgeSearchInput {
  query: string;
  folderId?: string;
  size?: number;
}

export type KnowledgeSearchHitSource =
  | {
      kind: 'knowledge-document';
      documentId: string;
      displayName: string;
      originalName: string;
      contentType?: string | null;
    }
  | {
      kind: 'course';
      courseId: string;
      name: string;
      blockId?: string | null;
    };

export interface KnowledgeSearchHit {
  id: string;
  type: string;
  text: string;
  metadata?: Record<string, unknown>;
  source?: KnowledgeSearchHitSource;
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
