import { PaginationQuery } from './common';

export interface ProgramsListQuery extends PaginationQuery {
  search?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  creatorUid: string;
  courseCount: number;
  learnerCount: number;
  createdAt: string;
}

export interface ProgramsCreateInput {
  name: string;
  courseIds?: string[];
}
