import { PaginationQuery } from './common';

export type SkillAssociationEntityType = 'course' | 'sign_off';

export interface Skill {
  id: string;
  name: string;
  orgId: string;
  creatorUid: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsListQuery extends PaginationQuery {
  search?: string;
}

export interface SkillsCreateInput {
  name: string;
}

export interface SkillsUpdateInput {
  skillId: string;
  name?: string;
}

export interface SkillAssociation {
  entityType: SkillAssociationEntityType;
  entityId: string;
}

export interface SkillsSetEntityInput {
  entityType: SkillAssociationEntityType;
  entityId: string;
  skillIds: string[];
}

export interface SkillsGetEntityQuery {
  entityType: SkillAssociationEntityType;
  entityId: string;
}
