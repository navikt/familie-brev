import { Feil } from '../server/utils/Feil';
import type { BegrunnelseMedData, IEØSBegrunnelsedata, IStandardbegrunnelsedata } from './typer';
import {
  AnnenForeldersAktivitet,
  Begrunnelsetype,
  SøkersAktivitet,
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

export const hentSøkerOgEllerBarnetBarnaValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  const valgfeltNavn = `'du/deg og/eller barnet/barna'`;

  if (data.gjelderSoker === undefined) {
    throw new Feil(
      `Valgfelt ${valgfeltNavn} er avhengig av "gjelderSoker", men verdien ble ikke sendt med`,
      400,
    );
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

export const hentDuEllerDuOgDenAndreForelderenValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
    const valgfeltNavn = `'du/du og den andre forelderen'`;

    if (data.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
        throw lagFeilStøttesIkkeForEØS(valgfeltNavn, data);
    }

    if (data.gjelderSoker && data.gjelderAndreForelder) {
        return ValgfeltMuligheter.SØKER_OG_ANDRE_FORELDER
    } else if (data.gjelderSoker) {
        return ValgfeltMuligheter.KUN_SØKER
    } else throw new Feil(
        `Begrunnelsen må gjelde enten søker eller søker og annen forelder for å bruke ${valgfeltNavn} formulering for begrunnelse med apiNavn=${data.apiNavn}`,
        400,
    );
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

export const søkersAktivitetValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  const valgfeltNavn = `'søkers aktivitet'`;

  if (data.type !== Begrunnelsetype.EØS_BEGRUNNELSE) {
    throw lagFeilStøttesKunForEØS(valgfeltNavn, data);
  }

  switch (data.sokersAktivitet) {
    case SøkersAktivitet.ARBEIDER:
    case SøkersAktivitet.SELVSTENDIG_NÆRINGSDRIVENDE:
      return ValgfeltMuligheter.ARBEIDER;
    case SøkersAktivitet.MOTTAR_UFØRETRYGD:
    case SøkersAktivitet.MOTTAR_UTBETALING_SOM_ERSTATTER_LØNN:
    case SøkersAktivitet.MOTTAR_PENSJON:
      return ValgfeltMuligheter.FÅR_PENGER_SOM_ERSTATTER_LØNN;
    case SøkersAktivitet.UTSENDT_ARBEIDSTAKER_FRA_NORGE:
      return ValgfeltMuligheter.UTSENDT_ARBEIDSTAKER_FRA_NORGE;
    case SøkersAktivitet.ARBEIDER_PÅ_NORSKREGISTRERT_SKIP:
      return ValgfeltMuligheter.ARBEIDER_PÅ_NORSKREGISTRERT_SKIP;
    case SøkersAktivitet.ARBEIDER_PÅ_NORSK_SOKKEL:
      return ValgfeltMuligheter.ARBEIDER_PÅ_NORSK_SOKKEL;
    case SøkersAktivitet.ARBEIDER_FOR_ET_NORSK_FLYSELSKAP:
      return ValgfeltMuligheter.ARBEIDER_FOR_NORSK_FLYSELSKAP;
    case SøkersAktivitet.ARBEIDER_VED_UTENLANDSK_UTENRIKSSTASJON:
      return ValgfeltMuligheter.ARBEIDER_VED_UTENLANDSK_UTENRIKSSTASJON;
    case SøkersAktivitet.MOTTAR_PENSJON_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET:
    case SøkersAktivitet.MOTTAR_UTBETALING_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET:
    case SøkersAktivitet.MOTTAR_UFØRETRYGD_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET:
      return ValgfeltMuligheter.UTBETALING_FRA_NAV_I_UTLANDET;
    case SøkersAktivitet.INAKTIV:
      return ValgfeltMuligheter.IKKE_I_ARBEIDSAKTIVITET;
    default:
      throw new Feil(
        `Ingen valg for søkers aktivitet="${data.sokersAktivitet}" ved bruk av
      ${valgfeltNavn} formulering for begrunnelse med apiNavn=${data.apiNavn}`,
        400,
      );
  }
};

export const annenForeldersAktivitetValg = (data: BegrunnelseMedData): ValgfeltMuligheter => {
  const valgfeltNavn = 'annen forelders aktivitet';

  if (data.type !== Begrunnelsetype.EØS_BEGRUNNELSE) {
    throw lagFeilStøttesKunForEØS(valgfeltNavn, data);
  }
  switch (data.annenForeldersAktivitet) {
    case AnnenForeldersAktivitet.I_ARBEID:
      return ValgfeltMuligheter.EOS_ANNEN_FORELDER_I_ARBEID;
    case AnnenForeldersAktivitet.MOTTAR_UTBETALING_SOM_ERSTATTER_LØNN:
      return ValgfeltMuligheter.EOS_ANNEN_FORELDER_MOTTAR_UTBETALING;
    case AnnenForeldersAktivitet.MOTTAR_PENSJON:
      return ValgfeltMuligheter.EOS_ANNEN_FORELDER_MOTTAR_PENSJON;
    case AnnenForeldersAktivitet.FORSIKRET_I_BOSTEDSLAND:
      return ValgfeltMuligheter.EOS_ANNEN_FORELDER_FORSIKRET;
    case AnnenForeldersAktivitet.INAKTIV:
      return ValgfeltMuligheter.EOS_ANNEN_FORELDER_INAKTIV;
    case AnnenForeldersAktivitet.IKKE_AKTUELT:
    default:
      throw new Feil(
        `Ingen valg for annen forelders aktivitet="${data.annenForeldersAktivitet}" ved bruk av
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

const lagFeilStøttesKunForEØS = (valgfeltNavn: string, data: IStandardbegrunnelsedata): Feil =>
  new Feil(
    `${valgfeltNavn} støttes kun for EØS-begrunnelser, men brukes i begrunnelse med apiNavn=${data.apiNavn}`,
    400,
  );
