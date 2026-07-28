import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';

import { Quinn, QuinnUnknownQueryParamError, MembersListQuery } from '../src/index';
import { startRecordingApi, type RecordingApi } from './helpers/recording-api';

let api: RecordingApi;

function client() {
  return new Quinn({
    apiUrl: api.url,
    token: 'test-token',
    orgId: 'org-test',
  });
}

before(async () => {
  api = await startRecordingApi();
});

after(async () => {
  await api.close();
});

beforeEach(() => {
  api.reset();
});

describe('members.list query params', () => {
  it('forwards status to the API', async () => {
    await client().members.list({ status: 'all' });

    const request = api.lastRequest();
    assert.equal(request.pathname, '/platform/v1/orgs/org-test/members');
    assert.equal(request.query.get('status'), 'all');
  });

  for (const status of ['current', 'former', 'all', 'deactivated', 'active'] as const) {
    it(`forwards status=${status} verbatim so the API validates it`, async () => {
      await client().members.list({ status });

      assert.equal(api.lastRequest().query.get('status'), status);
    });
  }

  it('lets the API reject an invalid status instead of narrowing it locally', async () => {
    api.respondWith(400, {
      message:
        'invalid member status "former,current": expected one of current, former, all',
    });

    await assert.rejects(
      // The value is invalid on purpose: a caller reaching the SDK from a
      // transpile-only runtime can send it, and it must produce the API's 400
      // rather than a 200 over the default current set.
      () =>
        client().members.list({
          status: 'former,current',
        } as unknown as MembersListQuery),
      (error: unknown) => {
        assert.equal((error as { response?: { status?: number } }).response?.status, 400);
        return true;
      }
    );
    assert.equal(api.lastRequest().query.get('status'), 'former,current');
  });

  it('omits status when the caller did not set one', async () => {
    await client().members.list({ limit: 5 });

    const request = api.lastRequest();
    assert.equal(request.query.has('status'), false);
    assert.equal(request.query.get('limit'), '5');
  });

  it('still forwards the pre-existing params', async () => {
    await client().members.list({
      limit: 10,
      token: 'page-2',
      search: 'ada',
      managerUid: 'mgr-1',
      groupId: 'grp-1',
      locationId: 'loc-1',
      roleId: 'role-1',
      privilege: ['admin', 'member'],
    });

    const { query } = api.lastRequest();
    assert.equal(query.get('limit'), '10');
    assert.equal(query.get('token'), 'page-2');
    assert.equal(query.get('search'), 'ada');
    assert.equal(query.get('managerUid'), 'mgr-1');
    assert.equal(query.get('groupId'), 'grp-1');
    assert.equal(query.get('locationId'), 'loc-1');
    assert.equal(query.get('roleId'), 'role-1');
    assert.equal(query.get('privilege'), 'admin,member');
  });
});

// The defect this guards: members.list built axios `params` by copying a fixed
// list of keys, so any other key vanished between the caller and the wire. The
// request went out narrower than asked, the API never saw the param, its
// validation never ran, and the caller got a 200 for a different question.
// A param the SDK does not know about must come back as an error, never as a
// quietly narrower result.
describe('members.list never drops a param silently', () => {
  const candidateParams: Array<[string, unknown]> = [
    // supported today
    ['limit', 3],
    ['token', 'page-2'],
    ['search', 'ada'],
    ['managerUid', 'mgr-1'],
    ['groupId', 'grp-1'],
    ['locationId', 'loc-1'],
    ['roleId', 'role-1'],
    ['privilege', 'admin'],
    ['status', 'former'],
    // params the API may grow, or that a caller may simply invent: unknown to
    // this SDK version, and therefore must not be swallowed
    ['includeDeactivated', 'true'],
    ['deactivatedAfter', '2026-01-01T00:00:00Z'],
    ['sort', 'lastName'],
    ['stauts', 'former'], // typo of a real param: the worst silent-drop case
  ];

  for (const [param, value] of candidateParams) {
    it(`forwards or rejects "${param}", never drops it`, async () => {
      api.reset();
      let thrown: unknown;
      try {
        await client().members.list({ [param]: value } as MembersListQuery);
      } catch (error) {
        thrown = error;
      }

      if (thrown) {
        assert.ok(
          thrown instanceof QuinnUnknownQueryParamError,
          `expected QuinnUnknownQueryParamError for "${param}", got ${String(thrown)}`
        );
        assert.deepEqual(thrown.unknownParams, [param]);
        assert.equal(
          api.requests.length,
          0,
          `"${param}" was rejected, so no request should have been sent`
        );
        return;
      }

      assert.equal(api.requests.length, 1, `"${param}" sent no request`);
      assert.equal(
        api.lastRequest().query.get(param),
        String(value),
        `"${param}" was accepted but never reached the wire`
      );
    });
  }

  it('names every unsupported param it rejects', async () => {
    await assert.rejects(
      () =>
        client().members.list({
          status: 'all',
          includeDeactivated: true,
          sort: 'lastName',
        } as MembersListQuery),
      (error: unknown) => {
        assert.ok(error instanceof QuinnUnknownQueryParamError);
        assert.deepEqual(error.unknownParams, ['includeDeactivated', 'sort']);
        assert.equal(error.code, 'UNKNOWN_QUERY_PARAM');
        return true;
      }
    );
    assert.equal(api.requests.length, 0);
  });

  it('ignores an explicitly undefined unsupported param', async () => {
    // Generated callers spread optional values in unconditionally; `undefined`
    // carries no caller intent, so it is not a dropped filter.
    await client().members.list({ sort: undefined } as MembersListQuery);

    assert.equal(api.requests.length, 1);
    assert.equal(api.lastRequest().query.has('sort'), false);
  });
});
