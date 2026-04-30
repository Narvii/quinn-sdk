import { PaginationQuery } from './common';

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
