import type { Request } from 'express';
import type { Meta } from '@navikt/familie-logging';

export const genererMetadata = (req: Request): Meta => {
  const callId = req.header('nav-call-id');
  return callId ? { x_callId: callId } : {};
};
