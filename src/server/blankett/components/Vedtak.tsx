import React from 'react';
import { AvslåVedtak } from './AvslåVedtak';
import { InnvilgetOvergangsstønad } from './InnvilgetOvergangsstønad';
import { InnvilgetBarnetilsyn } from './InnvilgetBarnetilsyn';
import { InnvilgetSkolepenger } from './InnvilgetSkolepenger';
import { InnvilgetGOmregning } from './InnvilgetGOmregning';
import type {
  IVedtak,
  ISøknadsdatoer,
  IInnvilgeVedtakOvergangsstønad,
  IInnvilgeVedtakBarnetilsyn,
  IInnvilgeVedtakSkolepenger,
  IKontantstøttePerioder,
} from '../../../typer/dokumentApiBlankett';
import {
  EStønadType,
  EBehandlingÅrsak,
  EBehandlingResultat,
} from '../../../typer/dokumentApiBlankett';

export const Vedtak: React.FC<{
  stønadstype: EStønadType;
  vedtak: IVedtak;
  søknadsdatoer?: ISøknadsdatoer;
  årsak: EBehandlingÅrsak;
  kontantstøttePerioderFraKs: IKontantstøttePerioder[];
}> = ({ stønadstype, vedtak, søknadsdatoer, årsak, kontantstøttePerioderFraKs }) => {
  switch (vedtak.resultatType) {
    case EBehandlingResultat.INNVILGE:
      return (
        <InnvilgetVedtak
          stønadstype={stønadstype}
          vedtak={vedtak}
          søknadsdatoer={søknadsdatoer}
          årsak={årsak}
          kontantstøttePerioderFraKs={kontantstøttePerioderFraKs}
        />
      );
    case EBehandlingResultat.AVSLÅ:
      return <AvslåVedtak {...vedtak} />;
    default:
      return null;
  }
};

const InnvilgetVedtak: React.FC<{
  stønadstype: EStønadType;
  vedtak: IVedtak;
  søknadsdatoer?: ISøknadsdatoer;
  årsak: EBehandlingÅrsak;
  kontantstøttePerioderFraKs: IKontantstøttePerioder[];
}> = ({ stønadstype, vedtak, søknadsdatoer, årsak, kontantstøttePerioderFraKs }) => {
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
          kontantstøttePerioderFraKs={kontantstøttePerioderFraKs}
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
