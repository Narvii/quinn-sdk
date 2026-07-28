/**
 * Prints the raw request line the SDK puts on the wire for
 * `members.list({ status })`, before and after this change. Run with:
 *   node --import tsx test/evidence-status-reaches-api.ts
 */
import { Quinn } from '../src/index';
import { startRecordingApi } from './helpers/recording-api';

async function main() {
  const api = await startRecordingApi();
  const quinn = new Quinn({ apiUrl: api.url, token: 't', orgId: 'org-test' });

  await quinn.members.list({ status: 'all' });
  console.log('members.list({ status: "all" }) ->', api.lastRequest().rawUrl);

  api.reset();
  await quinn.members.list({ status: 'former', limit: 2 });
  console.log(
    'members.list({ status: "former", limit: 2 }) ->',
    api.lastRequest().rawUrl
  );

  api.reset();
  try {
    await quinn.members.list({ includeDeactivated: true } as never);
  } catch (error) {
    console.log(
      'members.list({ includeDeactivated: true }) ->',
      (error as Error).name,
      `(requests sent: ${api.requests.length})`
    );
  }

  await api.close();
}

void main();
