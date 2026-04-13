import { AxiosInstance } from 'axios';
import {
  AssessmentResult,
  AssessmentResultsListQuery,
  PagedResult,
} from '../types';

export class AssessmentsService {
  constructor(
    private readonly http: AxiosInstance
  ) {}

  async listResults(
    query: AssessmentResultsListQuery
  ): Promise<PagedResult<AssessmentResult>> {
    const params: Record<string, string | number | undefined> = {
      courseIds: query.courseIds.join(','),
      learnerIds: query.learnerIds?.join(','),
      status: query.status,
      limit: query.limit,
      token: query.token,
    };

    const resp = await this.http.get<PagedResult<AssessmentResult>>(
      '/assessment-results',
      { params }
    );
    return resp.data;
  }
}
