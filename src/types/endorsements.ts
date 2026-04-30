export interface Endorsement {
  id: string;
  uid: string;
  competencyId: string;
  roleId: string | null;
  selfAssessment: string | null;
  selfAssessedAt: string | null;
  endorsedAt: string | null;
  endorsedByUid: string | null;
  endorsementSource: string | null;
  resetAt: string | null;
  resetByUid: string | null;
  resetReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListEndorsementsInput {
  uids: string[];
  competencyIds: string[];
}

export interface EndorseCompetencyInput {
  uid: string;
  competencyId: string;
  note?: string;
}

export interface ResetEndorsementInput {
  uid: string;
  competencyId: string;
  reason: string;
}
