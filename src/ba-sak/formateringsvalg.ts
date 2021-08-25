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
