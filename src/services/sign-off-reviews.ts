import { AxiosInstance } from 'axios';
import {
  type PagedResult,
  type SignOffReviewAttempt,
  type SignOffReviewAttemptsQuery,
} from '../types';

export class SignOffReviewsService {
  constructor(private readonly http: AxiosInstance) {}

  async listAttempts(
    query: SignOffReviewAttemptsQuery = {}
  ): Promise<PagedResult<SignOffReviewAttempt>> {
    const resp = await this.http.get<PagedResult<SignOffReviewAttempt>>(
      '/sign-off-review-attempts',
      { params: { decision: query.decision, limit: query.limit, token: query.token } }
    );
    return resp.data;
  }
}
