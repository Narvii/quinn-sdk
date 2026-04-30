import { PaginationQuery } from './common';

export interface Level {
  id: string;
  roleId: string;
  name: string;
  color: string;
  value: number;
  completeThreshold: number;
  revenueCapacity: number | null;
  compensation: string | null;
  competencyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LevelsListQuery extends PaginationQuery {
  roleId: string;
}
