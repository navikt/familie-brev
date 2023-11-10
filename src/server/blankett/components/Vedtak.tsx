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
} from '../../../typer/dokumentApi';
import { EStønadType, EBehandlingÅrsak, EBehandlingResultat } from '../../../typer/dokumentApi';

export const Vedtak: React.FC<{
  stønadstype: EStønadType;
  vedtak: IVedtak;
  søknadsdatoer?: ISøknadsdatoer;
  årsak: EBehandlingÅrsak;
}> = ({ stønadstype, vedtak, søknadsdatoer, årsak }) => {
  switch (vedtak.resultatType) {
    case EBehandlingResultat.INNVILGE:
      return (
        <InnvilgetVedtak
          stønadstype={stønadstype}
          vedtak={vedtak}
          søknadsdatoer={søknadsdatoer}
          årsak={årsak}
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
}> = ({ stønadstype, vedtak, søknadsdatoer, årsak }) => {
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
