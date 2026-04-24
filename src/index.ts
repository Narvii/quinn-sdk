import { AxiosInstance } from 'axios';
import {
  QuinnClientConfig,
  QuinnResolvedConfig,
  resolveQuinnConfig,
} from './config';
import { createQuinnHttpClient } from './http';
import {
  notifyMutationObserver,
  type QuinnMutationReceipt,
} from './mutations';
import { assertMutationAllowed, QuinnMutationGuardError } from './mutation-access';
import { AutomationsService } from './services/automations';
import { AuthoringService } from './services/authoring';
import { AssessmentsService } from './services/assessments';
import { AssignmentsService } from './services/assignments';
import { CompetenciesService } from './services/competencies';
import { CoursesService } from './services/courses';
import { EndorsementsService } from './services/endorsements';
import { GroupsService } from './services/groups';
import { KnowledgeService } from './services/knowledge';
import { LevelsService } from './services/levels';
import { LocationsService } from './services/locations';
import { MembersService } from './services/members';
import { OrganizationsService } from './services/organizations';
import { ProgressionsService } from './services/progressions';
import { ProgramsService } from './services/programs';
import { RolesService } from './services/roles';
import { SignOffService } from './services/sign-off';
import { WorkflowsService } from './services/workflows';

export * from './types';
export {
  DEFAULT_QUINN_API_URL,
  resolveApiUrl,
  resolveConfigPath,
} from './config';
export type { QuinnClientConfig } from './config';
export {
  getGlobalMutationObserver,
  notifyMutationObserver,
  setGlobalMutationObserver,
} from './mutations';
export type {
  QuinnAffectedResource,
  QuinnAffectedResourceType,
  QuinnMutationObserver,
  QuinnMutationReceipt,
} from './mutations';
export { QuinnMutationGuardError } from './mutation-access';
export { AutomationsService } from './services/automations';
export { AssessmentsService } from './services/assessments';
export { AuthoringService } from './services/authoring';
export {
  KnowledgeDocumentsService,
  KnowledgeFoldersService,
  KnowledgeService,
} from './services/knowledge';
export { LocationsService } from './services/locations';
export { ProgressionsService } from './services/progressions';
export { SignOffService } from './services/sign-off';
export { WorkflowsService } from './services/workflows';

export class Quinn {
  private readonly config: QuinnResolvedConfig;
  private readonly http: AxiosInstance;
  readonly automations: AutomationsService;
  readonly authoring: AuthoringService;
  readonly assessments: AssessmentsService;
  readonly organizations: OrganizationsService;
  readonly knowledge: KnowledgeService;
  readonly locations: LocationsService;
  readonly members: MembersService;
  readonly roles: RolesService;
  readonly levels: LevelsService;
  readonly competencies: CompetenciesService;
  readonly courses: CoursesService;
  readonly assignments: AssignmentsService;
  readonly progressions: ProgressionsService;
  readonly groups: GroupsService;
  readonly programs: ProgramsService;
  readonly endorsements: EndorsementsService;
  readonly signOff: SignOffService;
  readonly workflows: WorkflowsService;

  constructor(config: QuinnClientConfig = {}) {
    this.config = resolveQuinnConfig(config);
    this.http =
      this.config.httpClient ??
      createQuinnHttpClient({
        apiUrl: this.config.apiUrl,
        token: this.config.token,
        orgId: this.config.orgId,
      });
    this.automations = new AutomationsService(
      this.http,
      this.assertMutationAllowed,
      this.notifyMutationCommitted
    );
    this.authoring = new AuthoringService(this.http);
    this.assessments = new AssessmentsService(this.http);
    this.organizations = new OrganizationsService(this.http, this.assertMutationAllowed);
    this.knowledge = new KnowledgeService(this.http, this.assertMutationAllowed);
    this.locations = new LocationsService(this.http, this.assertMutationAllowed);
    this.members = new MembersService(this.http, this.assertMutationAllowed);
    this.roles = new RolesService(this.http, this.assertMutationAllowed);
    this.levels = new LevelsService(this.http);
    this.competencies = new CompetenciesService(this.http, this.assertMutationAllowed);
    this.courses = new CoursesService(this.http, this.assertMutationAllowed);
    this.assignments = new AssignmentsService(this.http);
    this.progressions = new ProgressionsService(this.http);
    this.groups = new GroupsService(this.http, this.assertMutationAllowed);
    this.programs = new ProgramsService(this.http, this.assertMutationAllowed);
    this.endorsements = new EndorsementsService(this.http, this.assertMutationAllowed);
    this.signOff = new SignOffService(
      this.http,
      this.assertMutationAllowed,
      this.notifyMutationCommitted
    );
    this.workflows = new WorkflowsService(
      this.http,
      this.assertMutationAllowed,
      this.notifyMutationCommitted
    );
  }

  private assertMutationAllowed = (operation: string): void => {
    assertMutationAllowed(this.config.allowQuinnMutation, operation);
  };

  private notifyMutationCommitted = async (
    receipt: QuinnMutationReceipt
  ): Promise<void> => {
    await notifyMutationObserver(this.config.onMutationCommitted, receipt);
  };
}
