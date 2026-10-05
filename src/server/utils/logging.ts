import type { Meta } from '@navikt/familie-logging';
import type { Request } from 'express';

export const genererMetadata = (req: Request): Meta => {
    const callId = req.header('nav-call-id');
    return callId ? { x_callId: callId } : {};
};
