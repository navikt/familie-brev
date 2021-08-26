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
import { IBegrunnelsedata, IPeriodedata } from '../../../ba-sak/typer';
import { validerBegrunnelse, validerBegrunnelsedata } from '../../../ba-sak/valideringer';
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

  function byggBegrunnelse(begrunnelseData: IBegrunnelsedata) {
    validerBegrunnelsedata(begrunnelseData);
    const begrunnelsetekstFraSanity = hentBegrunnelsetekst(
      begrunnelseData.apiNavn,
      begrunnelseData.maalform,
    );
    return (
      begrunnelsetekstFraSanity && begrunnelseSerializer(begrunnelsetekstFraSanity, begrunnelseData)
    );
  }

  const byggBegrunnelser = (begrunnelser: IBegrunnelsedata[] | Flettefelt): string[] => {
    const nyeBegrunnelser: string[] = [];
    begrunnelser.forEach((begrunnelse: IBegrunnelsedata | string) => {
      if (typeof begrunnelse === 'string') {
        nyeBegrunnelser.push(begrunnelse);
      } else {
        nyeBegrunnelser.push(byggBegrunnelse(begrunnelse));
      }
    });
    return nyeBegrunnelser;
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
