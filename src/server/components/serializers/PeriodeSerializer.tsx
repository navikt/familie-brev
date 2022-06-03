import React from 'react';
import { Flettefelt, Flettefelter } from '../../../typer/dokumentApi';
import FlettefeltSerializer from './FlettefeltSerializer';
import BlockSerializer from './BlockSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import useServerEffect from '../../utils/useServerEffect';
import { hentDokumentQuery } from '../../sanity/Queries';
import { client, Datasett } from '../../sanity/sanityClient';
import { DokumentType } from '../../../typer/dokumentType';
import { validerPeriode } from '../../utils/valideringer/validerPeriode';
import { Feil } from '../../utils/Feil';
import {
  Begrunnelse,
  BegrunnelseMedData,
  Begrunnelsetype,
  IPeriodedata,
} from '../../../ba-sak/typer';
import {
  validerBegrunnelse,
  validerEøsbegrunnelsedata,
  validerStandardbegrunnelsedata,
} from '../../../ba-sak/valideringer';
import { hentBegrunnelseTekstQuery } from '../../../ba-sak/queries';
import begrunnelseSerializer from '../../../ba-sak/begrunnelseSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface IPeriodeProps {
  sanityProps: any;
  perioder: IPeriodedata[];
  maalform: Maalform;
  datasett: Datasett;
  forelderApiNavn: string;
}

const PeriodeSerializer = (props: IPeriodeProps) => {
  const { perioder, maalform, datasett, forelderApiNavn } = props;
  // Om delmalen hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en delmalBlock finnes den i props.node.

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
    const query = hentBegrunnelseTekstQuery(begrunnelseApiNavn, målform);

    // eslint-disable-next-line react-app/react-hooks/rules-of-hooks
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
    return begrunnelser.map((begrunnelse: Begrunnelse | string) => {
      // Todo Kan fjernes etter at vi får inn endring i ba-sak
      if (typeof begrunnelse === 'string') {
        return begrunnelse;
      } else if (begrunnelse.type === Begrunnelsetype.FRITEKST) {
        return begrunnelse.fritekst;
      } else if (begrunnelse.type === Begrunnelsetype.STANDARD_BEGRUNNELSE) {
        return byggBegrunnelse(begrunnelse);
      } else if (begrunnelse.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
        throw new Feil('Ikke implementert', 400);
      } else {
        return byggBegrunnelse(begrunnelse);
      }
    });
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
      <BlockContent
        blocks={periode}
        serializers={{
          marks: {
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter: flettefelter as Flettefelter,
                dokumentApiNavn: periodeApiNavn,
              }),
          },
          types: {
            block: BlockSerializer,
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter: flettefelter as Flettefelter,
                dokumentApiNavn: periodeApiNavn,
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
