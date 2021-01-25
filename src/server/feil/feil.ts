import { ApiRessurs, RessursStatus } from '@navikt/familie-typer';

export class Feil<T> extends Error {
  public httpStatus: number;
  public apiRessurs: ApiRessurs<T>;

  constructor(apiRessurs: ApiRessurs<T>, httpStatus: number) {
    super(apiRessurs.melding);
    this.httpStatus = httpStatus;
    this.apiRessurs = apiRessurs;
  }
}

export const byggDataApiRessurs = <T>(data: T): ApiRessurs<T> => {
  return {
    data,
    status: RessursStatus.SUKSESS,
    melding: '',
    stacktrace: '',
  };
};

export const byggFeiletApiRessurs = (melding: string, stacktrace?: string): ApiRessurs<string> => {
  return {
    data: '',
    status: RessursStatus.FEILET,
    melding,
    stacktrace: stacktrace ?? '',
  };
};

export const byggFunksjonellFeilApiRessurs = (
  frontendFeilmelding: string,
  melding: string,
  stacktrace: string,
): ApiRessurs<string> => {
  return {
    data: '',
    status: RessursStatus.FUNKSJONELL_FEIL,
    frontendFeilmelding,
    melding,
    stacktrace,
  };
};
