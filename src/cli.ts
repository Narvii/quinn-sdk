#!/usr/bin/env node

import { Quinn } from './index';

type ParsedArgs = {
  apiUrl?: string;
  json: boolean;
  language?: string;
  orgId?: string;
  out?: string;
  path?: string;
  token?: string;
};

function usage(): string {
  return [
    'Usage:',
    '  quinn files transcribe-audio <path> [--out <path>] [--language <code>] [--json]',
    '',
    'Config flags:',
    '  --api-url <url>   Override QUINN_API_URL',
    '  --org-id <id>     Override QUINN_ORG_ID',
    '  --token <token>   Override QUINN_API_TOKEN',
  ].join('\n');
}

function takeValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = { json: false };
  const positional: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--api-url':
        parsed.apiUrl = takeValue(args, i, arg);
        i += 1;
        break;
      case '--json':
        parsed.json = true;
        break;
      case '--language':
        parsed.language = takeValue(args, i, arg);
        i += 1;
        break;
      case '--org-id':
        parsed.orgId = takeValue(args, i, arg);
        i += 1;
        break;
      case '--out':
        parsed.out = takeValue(args, i, arg);
        i += 1;
        break;
      case '--token':
        parsed.token = takeValue(args, i, arg);
        i += 1;
        break;
      case '-h':
      case '--help':
        throw new Error(usage());
      default:
        positional.push(arg);
        break;
    }
  }

  if (positional[0] !== 'files' || positional[1] !== 'transcribe-audio') {
    throw new Error(usage());
  }
  if (!positional[2]) {
    throw new Error('missing audio path\n\n' + usage());
  }

  parsed.path = positional[2];
  return parsed;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(usage());
    return;
  }

  const args = parseArgs(argv);
  const quinn = new Quinn({
    apiUrl: args.apiUrl,
    orgId: args.orgId,
    token: args.token,
  });

  const result = await quinn.files.transcribeAudio({
    language: args.language,
    outputPath: args.out,
    path: args.path as string,
  });

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (result.contentPath) {
    console.log(`Transcript written to ${result.contentPath}`);
    return;
  }

  console.log(result.text);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
