import * as Sentry from '@sentry/nextjs';

export async function onErrorCapture(err: Error) {
  Sentry.captureException(err);
}
