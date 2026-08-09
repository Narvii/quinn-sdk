import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const index = read('../dist/index.d.ts');
const typeIndex = read('../dist/types/index.d.ts');
const rolesService = read('../dist/services/roles.d.ts');
const roleTypes = read('../dist/types/roles.d.ts');

for (const domain of ['levels', 'competencies', 'endorsements']) {
  assert.doesNotMatch(index, new RegExp(`readonly ${domain}:`));
  assert.equal(
    existsSync(new URL(`../dist/services/${domain}.d.ts`, import.meta.url)),
    false
  );
  assert.equal(
    existsSync(new URL(`../dist/types/${domain}.d.ts`, import.meta.url)),
    false
  );
}

assert.doesNotMatch(typeIndex, /\.\/(levels|competencies|endorsements)/);
assert.doesNotMatch(rolesService, /updateLevels/);
assert.doesNotMatch(roleTypes, /levelIds|RoleLevelInput|RolesUpdateLevelsInput/);

assert.match(index, /readonly roles: RolesService/);
assert.match(rolesService, /list\(/);
assert.match(rolesService, /create\(/);
assert.match(rolesService, /update\(/);
assert.match(rolesService, /delete\(/);
