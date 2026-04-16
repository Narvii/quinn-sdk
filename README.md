# @kaizenlabs/quinn-sdk

Typed TypeScript SDK for Quinn Platform.

`@kaizenlabs/quinn-sdk` is an organization-scoped client for Quinn business domains such as members, roles, courses, assignments, sign-off, groups, programs, and knowledge.

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
const signOff = await quinn.signOff.list({ limit: 10 });

console.log(org.organization?.name, members.items.length, signOff.items.length);
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

## Mutation Receipts

The SDK can report successful business mutations without changing the return
shape of each service method.

```ts
import { Quinn, type QuinnMutationReceipt } from "@kaizenlabs/quinn-sdk";

const receipts: QuinnMutationReceipt[] = [];

const quinn = new Quinn({
  onMutationCommitted(receipt) {
    receipts.push(receipt);
  },
});

await quinn.signOff.createVersion("form_123", {
  inputDefs: [],
  schema: [],
  html: "<html></html>",
});

console.log(receipts);
// [
//   {
//     operation: "signOff.createVersion",
//     affectedResources: [{ type: "sign-off-form", id: "form_123" }],
//   },
// ]
```

For runtimes that cannot pass constructor callbacks into agent-generated
scripts, you can also register a process-wide observer before `new Quinn()`:

```ts
import { Quinn, setGlobalMutationObserver } from "@kaizenlabs/quinn-sdk";

setGlobalMutationObserver((receipt) => {
  console.log("mutation committed", receipt);
});

const quinn = new Quinn();
```
