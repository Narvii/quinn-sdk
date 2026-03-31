# @kaizenlabs/quinn-sdk

Typed TypeScript SDK for Quinn Platform.

`@kaizenlabs/quinn-sdk` is an organization-scoped client for Quinn business domains such as members, roles, courses, assignments, groups, programs, and knowledge.

## Install

```bash
npm i @kaizenlabs/quinn-sdk
```

## Usage

```ts
import { Quinn } from "@kaizenlabs/quinn-sdk";

const quinn = new Quinn();

const org = await quinn.organizations.current();
const members = await quinn.members.list({ limit: 20 });

console.log(org.organization?.name, members.items.length);
```

## Configuration

`new Quinn()` resolves configuration in this order:

1. constructor input
2. environment variables
3. config file

Supported environment variables:

- `QUINN_API_URL`
- `QUINN_API_TOKEN`
- `QUINN_ORG_ID`
- `QUINN_ALLOW_QUINN_MUTATION`
- `QUINN_CONFIG_PATH`

Default config file path:

```text
~/.config/quinn/config.json
```

## Mutation Guard

To block write operations:

```ts
import { Quinn } from "@kaizenlabs/quinn-sdk";

const quinn = new Quinn({
  allowQuinnMutation: false,
});
```
