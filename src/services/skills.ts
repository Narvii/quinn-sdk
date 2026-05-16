import { AxiosInstance } from 'axios';
import {
  PagedResult,
  Skill,
  SkillAssociation,
  SkillsCreateInput,
  SkillsGetEntityQuery,
  SkillsListQuery,
  SkillsSetEntityInput,
  SkillsUpdateInput,
} from '../types';

export class SkillsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async list(query?: SkillsListQuery): Promise<PagedResult<Skill>> {
    const resp = await this.http.get<PagedResult<Skill>>(
      '/learning/skills',
      { params: query ? { q: query.search, limit: query.limit, token: query.token } : undefined }
    );
    return resp.data;
  }

  async search(query?: string, limit?: number): Promise<Skill[]> {
    const resp = await this.http.get<Skill[]>(
      '/learning/skills/search',
      { params: { q: query, limit } }
    );
    return resp.data;
  }

  async create(input: SkillsCreateInput): Promise<Skill> {
    this.assertMutationAllowed('skills.create');
    const resp = await this.http.post<Skill>(
      '/learning/skills',
      input
    );
    return resp.data;
  }

  async update(input: SkillsUpdateInput): Promise<Skill> {
    this.assertMutationAllowed('skills.update');
    const resp = await this.http.put<Skill>(
      `/learning/skills/${input.skillId}`,
      { name: input.name }
    );
    return resp.data;
  }

  async delete(skillId: string): Promise<void> {
    this.assertMutationAllowed('skills.delete');
    await this.http.delete(`/learning/skills/${skillId}`);
  }

  async getEntitySkills(query: SkillsGetEntityQuery): Promise<Skill[]> {
    const resp = await this.http.get<Skill[]>(
      '/learning/skills/by-entity',
      { params: { entityType: query.entityType, entityId: query.entityId } }
    );
    return resp.data;
  }

  async setEntitySkills(input: SkillsSetEntityInput): Promise<void> {
    this.assertMutationAllowed('skills.setEntitySkills');
    await this.http.put('/learning/skills/by-entity', input);
  }

  async associate(
    skillId: string,
    association: SkillAssociation
  ): Promise<void> {
    this.assertMutationAllowed('skills.associate');
    await this.http.post(`/learning/skills/${skillId}/associations`, association);
  }

  async disassociate(
    skillId: string,
    association: SkillAssociation
  ): Promise<void> {
    this.assertMutationAllowed('skills.disassociate');
    await this.http.delete(`/learning/skills/${skillId}/associations`, {
      data: association,
    });
  }
}
