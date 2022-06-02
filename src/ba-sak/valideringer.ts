import { IEØSBegrunnelsedata, IStandardbegrunnelsedata } from './typer';
import { Feil } from '../server/utils/Feil';
import { Maalform } from '../typer/sanitygrensesnitt';

export const validerStandardbegrunnelsedata = (data: IStandardbegrunnelsedata) => {
  if (data === null) {
    throw new Feil('Det ble ikke sendt med data til begrunnelsen.', 400);
  }
  if (data.apiNavn === undefined) {
    throw new Feil('apiNavn ble ikke sendt med dataene til begrunnelsen', 400);
  }
  if (data.gjelderSoker === undefined) {
    throw new Feil(
      `gjelderSoker ble ikke sendt med dataene til begrunnelsen med apiNavn="${data.apiNavn}"`,
      400,
    );
  }
  if (data.antallBarn === undefined) {
    throw new Feil(
      `antallBarn ble ikke sendt med dataene til begrunnelsen med apiNavn="${data.apiNavn}"`,
      400,
    );
  }
  if (data.antallBarn < 0) {
    throw new Feil(
      `antallBarn kan ikke være et negativt tall for begrunnelse med apiNavn="${data.apiNavn}, men var ${data.antallBarn}"`,
      400,
    );
  }
  if (data.barnasFodselsdatoer === undefined) {
    throw new Feil(
      `barnasFodselsdatoer ble ikke sendt med dataene til begrunnelsenmed apiNavn="${data.apiNavn}"`,
      400,
    );
  }

  if ((typeof data.barnasFodselsdatoer as any) !== 'string') {
    throw new Feil(
      `barnasFodselsdatoer skal være en string, men fødselsdatoene ble sent som "${typeof data.barnasFodselsdatoer}"` +
        `for med begrunnelse apiNavn="${data.apiNavn}"`,
      400,
    );
  }

  if (!Object.values(Maalform).includes(data.maalform)) {
    throw new Feil(
      `Målformen "${data.maalform}" finnes ikke for med begrunnelse apiNavn="${data.apiNavn}"`,
      404,
    );
  }
};

export const validerBegrunnelse = (begrunnelseFraSanity: any, apiNavn: string) => {
  if (begrunnelseFraSanity === null) {
    throw new Feil(`Fant ikke begrunnelse med apiNavn ${apiNavn}`, 404);
  }
};

export const validerEøsbegrunnelsedata = (data: IEØSBegrunnelsedata) => {
  if (data === null) {
    throw new Feil('Det ble ikke sendt med data til begrunnelsen.', 400);
  }
  if (data.apiNavn === undefined) {
    throw new Feil('apiNavn ble ikke sendt med dataene til begrunnelsen', 400);
  }
  if (data.antallBarn === undefined) {
    throw new Feil(
      `antallBarn ble ikke sendt med dataene til begrunnelsen med apiNavn="${data.apiNavn}"`,
      400,
    );
  }
  if (data.antallBarn < 0) {
    throw new Feil(
      `antallBarn kan ikke være et negativt tall for begrunnelse med apiNavn="${data.apiNavn}, men var ${data.antallBarn}"`,
      400,
    );
  }
  if (data.barnasFodselsdatoer === undefined) {
    throw new Feil(
      `barnasFodselsdatoer ble ikke sendt med dataene til begrunnelsenmed apiNavn="${data.apiNavn}"`,
      400,
    );
  }

  if ((typeof data.barnasFodselsdatoer as any) !== 'string') {
    throw new Feil(
      `barnasFodselsdatoer skal være en string, men fødselsdatoene ble sent som "${typeof data.barnasFodselsdatoer}"` +
        `for med begrunnelse apiNavn="${data.apiNavn}"`,
      400,
    );
  }

  if (!Object.values(Maalform).includes(data.maalform)) {
    throw new Feil(
      `Målformen "${data.maalform}" finnes ikke for med begrunnelse apiNavn="${data.apiNavn}"`,
      404,
    );
  }
};
