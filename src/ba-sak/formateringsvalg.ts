import { Feil } from '../server/utils/Feil';
import { ValgfeltMuligheter, IBegrunnelsedata } from './typer';

export const hentForBarnFodtValg = (data: IBegrunnelsedata): ValgfeltMuligheter => {
  if (data.antallBarn === 0) {
    return ValgfeltMuligheter.INGEN_BARN;
  } else {
    return ValgfeltMuligheter.ETT_ELLER_FLERE_BARN;
  }
};

export const hentDuOgEllerBarnetBarnaValg = (data: IBegrunnelsedata): ValgfeltMuligheter => {
  if (data.antallBarn === 0) {
    return ValgfeltMuligheter.INGEN_BARN;
  } else if (data.antallBarn === 1) {
    return ValgfeltMuligheter.ETT_BARN;
  } else {
    return ValgfeltMuligheter.FLERE_BARN;
  }
};

export const hentBarnetBarnaValg = (data: IBegrunnelsedata): ValgfeltMuligheter => {
  if (data.antallBarn < 1) {
    throw new Feil(
      `Må ha barn for å bruke barnet/barna formulering, men antall barn var ${data.antallBarn} for begrunnelse med apiNavn=${data.apiNavn}`,
      400,
    );
  } else if (data.antallBarn === 1) {
    return ValgfeltMuligheter.ETT_BARN;
  } else {
    return ValgfeltMuligheter.FLERE_BARN;
  }
};
