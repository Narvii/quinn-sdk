export type QuinnAffectedResourceType =
  | 'sign-off-form'
  | 'workflow'
  | 'workflow-version';

export interface QuinnAffectedResource {
  type: QuinnAffectedResourceType;
  id: string;
}

export interface QuinnMutationReceipt {
  operation: string;
  affectedResources: QuinnAffectedResource[];
}

export type QuinnMutationObserver = (
  receipt: QuinnMutationReceipt
) => void | Promise<void>;

const GLOBAL_MUTATION_OBSERVER_KEY = '__quinnOnMutationCommitted';

type GlobalWithMutationObserver = typeof globalThis & {
  [GLOBAL_MUTATION_OBSERVER_KEY]?: QuinnMutationObserver;
};

export function getGlobalMutationObserver():
  | QuinnMutationObserver
  | undefined {
  const observer = (globalThis as GlobalWithMutationObserver)[
    GLOBAL_MUTATION_OBSERVER_KEY
  ];
  return typeof observer === 'function' ? observer : undefined;
}

export function setGlobalMutationObserver(
  observer?: QuinnMutationObserver
): void {
  if (observer) {
    (globalThis as GlobalWithMutationObserver)[GLOBAL_MUTATION_OBSERVER_KEY] =
      observer;
    return;
  }

  delete (globalThis as GlobalWithMutationObserver)[
    GLOBAL_MUTATION_OBSERVER_KEY
  ];
}

export async function notifyMutationObserver(
  observer: QuinnMutationObserver | undefined,
  receipt: QuinnMutationReceipt
): Promise<void> {
  if (!observer) {
    return;
  }

  try {
    await observer(receipt);
  } catch {
    // Mutation observers are side-effect listeners. A reporting failure should
    // not mask the already-committed Quinn mutation.
  }
}
