import { PaginationQuery } from './common';

export interface Competency {
  id: string;
  name: string;
  description: string;
  creatorUid: string;
  createdAt: string;
  settings?: {
    managerOnlyEndorsement: boolean;
  };
  courseCount: number;
  courseIds: string[];
  levelLinks: CompetencyLevelLink[];
}

export interface CompetencyLevelLink {
  competencyId: string;
  levelId: string;
  levelName: string;
  levelColor: string;
  roleId: string;
  roleName: string;
}

export interface CompetenciesCreateInput {
  name: string;
  description?: string;
  roleId: string;
  levelIds: string[];
  settings?: {
    managerOnlyEndorsement?: boolean;
  };
}

export interface CompetenciesUpdateInput {
  competencyId: string;
  name?: string;
  description?: string;
  roleId?: string;
  levelIds?: string[];
  settings?: {
    managerOnlyEndorsement?: boolean;
  };
}

export interface CompetenciesListQuery extends PaginationQuery {
  roleId?: string;
  levelId?: string;
  search?: string;
}

export interface LearnerCompetencyProgressQuery {
  roleId?: string;
  levelId?: string;
  managerId?: string;
  groupId?: string;
  locationId?: string;
}

export interface LearnerCompetencyProgressResponse {
  learners: LearnerCompetencyProgress[];
}

export interface LearnerCompetencyProgress {
  userId: string;
  user: LearnerSummary | null;
  roleId: string | null;
  levelProgressions: Record<string, LevelProgression>;
  competencyProgressions: Record<string, CompetencyProgression>;
}

export interface LearnerSummary {
  uid: string;
  username: string;
  email: string | null;
}

export interface LevelProgression {
  progress: number;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  unlocked: boolean;
}

export interface CompetencyProgression {
  progress: number;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  endorsedAt: string | null;
  selfAssessment: 'yes' | 'unsure' | 'no' | null;
  selfAssessedAt: string | null;
}
