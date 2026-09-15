import * as Sentry from '@sentry/nextjs';

export function onRequestError(
  err: {
    digest: string;
  } & Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  },
  context: {
    routerKind: string;
    routeType: string;
    routePath: string;
  },
): void {
  Sentry.captureException(err, {
    extra: {
      request,
      context,
    },
  });
}
