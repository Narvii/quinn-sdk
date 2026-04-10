import { AxiosInstance } from 'axios';
import {
  PagedResult,
  Progression,
  ProgressionsListQuery,
} from '../types';

export class ProgressionsService {
  constructor(
    private readonly http: AxiosInstance
  ) {}

  async list(
    query: ProgressionsListQuery = {}
  ): Promise<PagedResult<Progression>> {
    const params: Record<string, string | number | undefined> = {
      limit: query.limit,
      token: query.token,
      courseId: query.courseId,
      groupId: query.groupId,
      activeAfter: query.activeAfter,
      activeBefore: query.activeBefore,
      learnerIds: query.learnerIds?.join(','),
    };

    const resp = await this.http.get<PagedResult<Progression>>(
      '/progressions',
      { params }
    );
    return resp.data;
  }
}
