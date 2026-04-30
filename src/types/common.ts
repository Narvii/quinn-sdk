export type Privilege = 'owner' | 'admin' | 'content-creator' | 'member';

export interface PaginationQuery {
  limit?: number;
  token?: string;
}

export interface PagedResult<T> {
  items: T[];
  nextToken: string;
}

export type CourseType = 'training' | 'assessment' | 'sign-off';

export interface MediaRef {
  mediaId: string;
  url: string;
}

export interface AssignedUser {
  email: string;
  userId: string;
  assigned: boolean;
}
