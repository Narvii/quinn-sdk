import { PaginationQuery } from './common';

export interface Role {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolesListQuery extends PaginationQuery {}

export interface RolesCreateInput {
  label: string;
}

export interface RolesUpdateInput {
  roleId: string;
  label?: string;
}
