export class QuinnUnknownQueryParamError extends Error {
  readonly operation: string;
  readonly unknownParams: string[];
  readonly supportedParams: string[];
  readonly code: 'UNKNOWN_QUERY_PARAM';

  constructor(input: {
    operation: string;
    unknownParams: string[];
    supportedParams: string[];
  }) {
    super(
      `Quinn SDK does not support query param(s) ${input.unknownParams
        .map((name) => `"${name}"`)
        .join(', ')} on "${input.operation}". Supported: ${input.supportedParams.join(
        ', '
      )}. Upgrade @kaizenlabs/quinn-sdk if the API has since added the param.`
    );
    this.name = 'QuinnUnknownQueryParamError';
    this.operation = input.operation;
    this.unknownParams = input.unknownParams;
    this.supportedParams = input.supportedParams;
    this.code = 'UNKNOWN_QUERY_PARAM';
  }
}

export type QueryParamValue = string | number | undefined;

/**
 * Turns a caller query object into axios `params`, forwarding every supported
 * key and throwing on any key it does not recognize.
 *
 * A hand-written whitelist that copies known keys one by one drops everything
 * else without a sound: the request goes out narrower than the caller asked
 * for, the API never sees the param, its validation never runs, and the caller
 * gets a 200 for a question it did not ask. Callers reach this SDK from
 * transpile-only runtimes (tsx) where the compile-time types do not stop them,
 * so the guard has to exist here, at runtime. Forward or reject — never drop.
 */
export function buildQueryParams<T extends object>(
  operation: string,
  query: T,
  supportedParams: ReadonlyArray<keyof T & string>
): Record<string, QueryParamValue> {
  const supported = new Set<string>(supportedParams);
  const unknownParams = Object.keys(query).filter(
    (key) => !supported.has(key) && (query as Record<string, unknown>)[key] !== undefined
  );

  if (unknownParams.length > 0) {
    throw new QuinnUnknownQueryParamError({
      operation,
      unknownParams,
      supportedParams: [...supportedParams],
    });
  }

  const params: Record<string, QueryParamValue> = {};
  for (const key of supportedParams) {
    params[key] = normalizeQueryParamValue(
      (query as Record<string, unknown>)[key]
    );
  }
  return params;
}

function normalizeQueryParamValue(value: unknown): QueryParamValue {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length === 0 ? undefined : value.join(',');
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }
  return String(value);
}
