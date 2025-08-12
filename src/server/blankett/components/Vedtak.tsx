import React from 'react';
import { AvslåVedtak } from './AvslåVedtak';
import { InnvilgetOvergangsstønad } from './InnvilgetOvergangsstønad';
import { InnvilgetBarnetilsyn } from './InnvilgetBarnetilsyn';
import { InnvilgetSkolepenger } from './InnvilgetSkolepenger';
import { InnvilgetGOmregning } from './InnvilgetGOmregning';
import {
  EBehandlingResultat,
  EBehandlingÅrsak,
  EStønadType,
  IInnvilgeVedtakBarnetilsyn,
  IInnvilgeVedtakOvergangsstønad,
  IInnvilgeVedtakSkolepenger,
  IKontantstøttePerioder,
  ISøknadsdatoer,
  IVedtak,
} from '../../../typer/dokumentApiBlankett';
import { OpphørVedtak } from './OpphørVedtak';

export const Vedtak: React.FC<{
  stønadstype: EStønadType;
  vedtak: IVedtak;
  søknadsdatoer?: ISøknadsdatoer;
  årsak: EBehandlingÅrsak;
  harKontantstøttePerioder: boolean;
  kontantstøttePerioderFraKs: IKontantstøttePerioder[];
  registeropplysningerOpprettetDato: string;
}> = ({
  stønadstype,
  vedtak,
  søknadsdatoer,
  årsak,
  kontantstøttePerioderFraKs,
  harKontantstøttePerioder,
  registeropplysningerOpprettetDato,
}) => {
  switch (vedtak.resultatType) {
    case EBehandlingResultat.INNVILGE:
      return (
        <InnvilgetVedtak
          stønadstype={stønadstype}
          vedtak={vedtak}
          søknadsdatoer={søknadsdatoer}
          årsak={årsak}
          harKontantstøttePerioder={harKontantstøttePerioder}
          kontantstøttePerioderFraKs={kontantstøttePerioderFraKs}
          registeropplysningerOpprettetDato={registeropplysningerOpprettetDato}
        />
      );
    case EBehandlingResultat.AVSLÅ:
      return <AvslåVedtak {...vedtak} />;
    case EBehandlingResultat.OPPHØR:
      return <OpphørVedtak {...vedtak} />;
    default:
      return null;
  }
};

const InnvilgetVedtak: React.FC<{
  stønadstype: EStønadType;
  vedtak: IVedtak;
  søknadsdatoer?: ISøknadsdatoer;
  årsak: EBehandlingÅrsak;
  harKontantstøttePerioder: boolean;
  kontantstøttePerioderFraKs: IKontantstøttePerioder[];
  registeropplysningerOpprettetDato: string;
}> = ({
  stønadstype,
  vedtak,
  søknadsdatoer,
  årsak,
  kontantstøttePerioderFraKs,
  harKontantstøttePerioder,
  registeropplysningerOpprettetDato,
}) => {
  if (årsak === EBehandlingÅrsak.G_OMREGNING) {
    return <InnvilgetGOmregning vedtak={vedtak as IInnvilgeVedtakOvergangsstønad} />;
  }

  switch (stønadstype) {
    case EStønadType.OVERGANGSSTØNAD:
      return (
        <InnvilgetOvergangsstønad
          vedtak={vedtak as IInnvilgeVedtakOvergangsstønad}
          søknadsdatoer={søknadsdatoer}
        />
      );
    case EStønadType.BARNETILSYN:
      return (
        <InnvilgetBarnetilsyn
          vedtak={vedtak as IInnvilgeVedtakBarnetilsyn}
          søknadsdatoer={søknadsdatoer}
          harKontantstøttePerioder={harKontantstøttePerioder}
          kontantstøttePerioderFraKs={kontantstøttePerioderFraKs}
          registeropplysningerOpprettetDato={registeropplysningerOpprettetDato}
        />
      );
    case EStønadType.SKOLEPENGER:
      return (
        <InnvilgetSkolepenger
          vedtak={vedtak as IInnvilgeVedtakSkolepenger}
          søknadsdatoer={søknadsdatoer}
        />
      );
  }
};
