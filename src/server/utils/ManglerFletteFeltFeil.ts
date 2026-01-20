import { logSecure, logWarn } from '@navikt/familie-logging';

export class ManglerFletteFeltFeil extends Error {
  public code: number;
  public error?: Error;

  constructor(message: string, code: number, error?: Error) {
    super(message);
    this.code = code;
    this.error = error;

    logWarn(message);
    logSecure(`${message}: ${error}`);
  }
}
