import { Feil } from '../server/utils/Feil';
import {
  BegrunnelseMedData,
  Begrunnelsetype,
  IEØSBegrunnelsedata,
  SøkersRettTilUtvidet,
  ValgfeltMuligheter,
} from './typer';

export const hentForBarnFodtValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  if (data.antallBarn === 0) {
    return ValgfeltMuligheter.INGEN_BARN;
  } else {
    return ValgfeltMuligheter.ETT_ELLER_FLERE_BARN;
  }
};

export const hentDuOgEllerBarnetBarnaValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  const valgfeltNavn = `'du og/eller barnet/barna'`;

  if (data.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
    throw lagFeilStøttesIkkeForEØS(valgfeltNavn, data);
  }

  if (data.gjelderSoker) {
    if (data.antallBarn === 0) {
      return ValgfeltMuligheter.INGEN_BARN;
    } else if (data.antallBarn === 1) {
      return ValgfeltMuligheter.ETT_BARN;
    } else {
      return ValgfeltMuligheter.FLERE_BARN;
    }
  } else {
    if (data.antallBarn === 0) {
      throw new Feil(
        `Må ha enten barn eller søker for å bruke ${valgfeltNavn} 
        formulering for begrunnelse med apiNavn=${data.apiNavn}`,
        400,
      );
    } else if (data.antallBarn === 1) {
      return ValgfeltMuligheter.ETT_BARN_IKKE_SØKER;
    } else {
      return ValgfeltMuligheter.FLERE_BARN_IKKE_SØKER;
    }
  }
};

export const hentBarnetBarnaValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  if (data.antallBarn < 1) {
    throw new Feil(
      `Må ha barn for å bruke barnet/barna formulering, men antall barn var 
      ${data.antallBarn} for begrunnelse med apiNavn=${data.apiNavn}`,
      400,
    );
  } else if (data.antallBarn === 1) {
    return ValgfeltMuligheter.ETT_BARN;
  } else {
    return ValgfeltMuligheter.FLERE_BARN;
  }
};

export const hentBarnetBarnaDineDittValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  if (data.antallBarn < 1) {
    throw new Feil(
      `Må ha barn for å bruke barnet/barna dine/ditt formulering, men antall barn var 
      ${data.antallBarn} for begrunnelse med apiNavn=${data.apiNavn}`,
      400,
    );
  } else if (data.antallBarn === 1) {
    return ValgfeltMuligheter.ETT_BARN;
  } else {
    return ValgfeltMuligheter.FLERE_BARN;
  }
};

export const hentDuOgEllerBarnFodtValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  const valgfeltNavn = `'du og/eller barn født'`;

  if (data.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
    throw lagFeilStøttesIkkeForEØS(valgfeltNavn, data);
  }

  if (data.gjelderSoker) {
    if (data.antallBarn === 0) {
      return ValgfeltMuligheter.INGEN_BARN;
    } else {
      return ValgfeltMuligheter.SØKER_OG_BARN;
    }
  } else {
    if (data.antallBarn === 0) {
      throw new Feil(
        `Må ha enten barn eller søker for å bruke ${valgfeltNavn} formulering for begrunnelse med apiNavn=${data.apiNavn}`,
        400,
      );
    } else {
      return ValgfeltMuligheter.KUN_BARN;
    }
  }
};

export const hentFraDatoValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  const valgfeltNavn = `'hent fra dato'`;

  if (data.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
    throw lagFeilStøttesIkkeForEØS(valgfeltNavn, data);
  }

  if (!data.maanedOgAarBegrunnelsenGjelderFor || data.maanedOgAarBegrunnelsenGjelderFor === '') {
    return ValgfeltMuligheter.INGEN_FRA_DATO;
  } else {
    return ValgfeltMuligheter.HAR_FRA_DATO;
  }
};

export const hentDuFårEllerHarRettTilUtvidetValg = (
  data: BegrunnelseMedData,
): ValgfeltMuligheter => {
  const valgfeltNavn = `'du får eller har rett til utvidet'`;

  if (data.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
    throw lagFeilStøttesIkkeForEØS(valgfeltNavn, data);
  }

  if (data.sokersRettTilUtvidet === SøkersRettTilUtvidet.SØKER_FÅR_UTVIDET) {
    return ValgfeltMuligheter.DU_FÅR;
  } else if (data.sokersRettTilUtvidet === SøkersRettTilUtvidet.SØKER_HAR_RETT_MEN_FÅR_IKKE) {
    return ValgfeltMuligheter.DU_HAR_RETT_TIL;
  } else {
    throw new Feil(
      `Søker må ha rett til utvidet for å bruke 
      ${valgfeltNavn} formulering for begrunnelse med apiNavn=${data.apiNavn}`,
      400,
    );
  }
};

const lagFeilStøttesIkkeForEØS = (valgfeltNavn: string, data: IEØSBegrunnelsedata): Feil =>
  new Feil(
    `${valgfeltNavn} støttes ikke for EØS-begrunnelser, men brukes i begrunnelse med apiNavn=${data.apiNavn}`,
    400,
  );
