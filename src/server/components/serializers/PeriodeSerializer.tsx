import React from 'react';
import type {
  Flettefelt,
  Flettefelter,
  IDokumentData,
  IDokumentDataMedPeriode,
} from '../../../typer/dokumentApiBrev';
import FlettefeltSerializer from './FlettefeltSerializer';
import BlockSerializer from './BlockSerializer';
import type { Maalform } from '../../../typer/sanitygrensesnitt';
import useServerEffect from '../../utils/useServerEffect';
import { hentDokumentQuery } from '../../sanity/Queries';
import type { Datasett } from '../../sanity/sanityClient';
import { client } from '../../sanity/sanityClient';
import { DokumentType } from '../../../typer/dokumentType';
import { validerPeriode } from '../../utils/valideringer/validerPeriode';
import { Feil } from '../../utils/Feil';
import type { Begrunnelse, BegrunnelseMedData, IPeriodedata } from '../../../baks/typer';
import { Begrunnelsetype } from '../../../baks/typer';
import {
  validerBegrunnelse,
  validerEøsbegrunnelsedata,
  validerStandardbegrunnelsedata,
} from '../../../baks/valideringer';
import { hentBegrunnelseTekstQuery } from '../../../baks/queries';
import begrunnelseSerializer from '../../../baks/begrunnelseSerializer';

import { PortableText } from '@portabletext/react';

interface IPeriodeProps {
  sanityProps: any;
  dokumentData: IDokumentData | undefined;
  maalform: Maalform;
  datasett: Datasett;
  forelderApiNavn: string;
}

const PeriodeSerializer = (props: IPeriodeProps) => {
  const { dokumentData, maalform, datasett, forelderApiNavn } = props;

  const erIDokumentDataMedPeriode = (
    dokumentData: IDokumentData | IDokumentDataMedPeriode | undefined,
  ): dokumentData is IDokumentDataMedPeriode => {
    return (dokumentData as IDokumentDataMedPeriode)?.perioder !== undefined;
  };

  if (!erIDokumentDataMedPeriode(dokumentData)) {
    return null;
  }

  const perioder = dokumentData.perioder;

  validerPeriode(forelderApiNavn, perioder);

  return (
    <div className={`delmal`}>
      {perioder.map((periode, index) => (
        <Periode
          key={`${(periode.type as Flettefelt)[0]}-${index}`}
          datasett={datasett}
          maalform={maalform}
          periodedata={periode}
        />
      ))}
    </div>
  );
};

const Periode = (props: { maalform: Maalform; datasett: Datasett; periodedata: IPeriodedata }) => {
  const { maalform, datasett, periodedata } = props;
  const periodeApiNavn = (periodedata.type as Flettefelt)[0];

  const [periode] = useServerEffect(undefined, periodeApiNavn, () => {
    const query = hentDokumentQuery(DokumentType.PERIODE, periodeApiNavn, maalform);
    return client(datasett)
      .fetch(query)
      .then((sanityPeriodeRespons: any) => {
        if (!sanityPeriodeRespons[maalform]) {
          throw new Feil(
            `Fant ikke ${maalform} tekst for "${periodeApiNavn}" i datasettet "${datasett}".`,
            404,
          );
        }
        return sanityPeriodeRespons[maalform];
      });
  });

  const hentBegrunnelsetekst = (begrunnelseApiNavn: string, målform: string): any => {
    const query = hentBegrunnelseTekstQuery(begrunnelseApiNavn, målform, datasett);
    return useServerEffect(undefined, query, () =>
      client(datasett)
        .fetch(query)
        .then(begrunnelseFraSanity => {
          validerBegrunnelse(begrunnelseFraSanity, begrunnelseApiNavn);
          return begrunnelseFraSanity;
        }),
    )[0];
  };

  const byggBegrunnelse = (begrunnelseData: BegrunnelseMedData) => {
    if (begrunnelseData.type === Begrunnelsetype.STANDARD_BEGRUNNELSE) {
      validerStandardbegrunnelsedata(begrunnelseData);
    } else if (begrunnelseData.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
      validerEøsbegrunnelsedata(begrunnelseData);
    }

    const begrunnelsetekstFraSanity = hentBegrunnelsetekst(
      begrunnelseData.apiNavn,
      begrunnelseData.maalform,
    );

    return (
      begrunnelsetekstFraSanity && begrunnelseSerializer(begrunnelsetekstFraSanity, begrunnelseData)
    );
  };

  const byggBegrunnelser = (begrunnelser: Begrunnelse[] | Flettefelt): string[] => {
    const bygdeBegrunnelser = begrunnelser.map((begrunnelse: Begrunnelse | string) => {
      if (typeof begrunnelse === 'string') {
        return begrunnelse;
      } else if (begrunnelse.type === Begrunnelsetype.FRITEKST) {
        return begrunnelse.fritekst;
      } else if (begrunnelse.type === Begrunnelsetype.STANDARD_BEGRUNNELSE) {
        return byggBegrunnelse(begrunnelse);
      } else if (begrunnelse.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
        return byggBegrunnelse(begrunnelse);
      } else {
        return byggBegrunnelse(begrunnelse);
      }
    });

    // Fjerner duplikate begrunnelser
    return [...new Set(bygdeBegrunnelser)];
  };

  const flettefelter = { ...periodedata };
  if (periodedata.begrunnelser) {
    flettefelter.begrunnelser = byggBegrunnelser(periodedata.begrunnelser);
  }

  if (!periode) {
    return null;
  }

  return (
    <div className={`delmal`}>
      <PortableText
        value={periode}
        components={{
          block: BlockSerializer,
          marks: {
            flettefelt: (sanityProps: any) =>
              FlettefeltSerializer({
                sanityProps: sanityProps,
                flettefelter: flettefelter as Flettefelter,
                dokumentApiNavn: periodeApiNavn,
                erListe: sanityProps?.value?.felt === 'begrunnelser',
              }),
          },
          types: {
            flettefelt: (sanityProps: any) =>
              FlettefeltSerializer({
                sanityProps: sanityProps,
                flettefelter: flettefelter as Flettefelter,
                dokumentApiNavn: periodeApiNavn,
                erListe: sanityProps?.value?.felt === 'begrunnelser',
              }),
            undefined: (_: any) => <div />,
          },
        }}
      />

      <div style={{ minHeight: '1rem' }} />
    </div>
  );
};

export default PeriodeSerializer;
