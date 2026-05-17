import { PaginationQuery } from './common';

export type CapabilityAssociationEntityType = 'course' | 'sign_off';

export interface Capability {
  id: string;
  name: string;
  orgId: string;
  creatorUid: string;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilitiesListQuery extends PaginationQuery {
  search?: string;
}

export interface CapabilitiesCreateInput {
  name: string;
}

export interface CapabilitiesUpdateInput {
  capabilityId: string;
  name?: string;
}

export interface CapabilityAssociation {
  entityType: CapabilityAssociationEntityType;
  entityId: string;
}

export interface CapabilitiesSetEntityInput {
  entityType: CapabilityAssociationEntityType;
  entityId: string;
  capabilityIds: string[];
}

export interface CapabilitiesGetEntityQuery {
  entityType: CapabilityAssociationEntityType;
  entityId: string;
}
