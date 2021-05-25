import React from 'react';
import { Flettefelter } from '../../../typer/dokumentApi';
import FlettefeltSerializer from './FlettefeltSerializer';
import BlockSerializer from './BlockSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import useServerEffect from '../../utils/useServerEffect';
import { hentDokumentQuery } from '../../sanity/Queries';
import { client, Datasett } from '../../sanity/sanityClient';
import { DokumentType } from '../../../typer/dokumentType';
import { validerPeriode } from '../../utils/valideringer/validerPeriode';
import { Feil } from '../../utils/Feil';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface IPeriodeProps {
  sanityProps: any;
  perioder: Flettefelter[];
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
          key={`${periode.type[0]}-${index}`}
          datasett={datasett}
          maalform={maalform}
          flettefelter={periode}
        />
      ))}
    </div>
  );
};

const Periode = (props: { maalform: Maalform; datasett: Datasett; flettefelter: Flettefelter }) => {
  const { maalform, datasett, flettefelter } = props;
  const periodeApiNavn = flettefelter.type[0];

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
                flettefelter,
                dokumentApiNavn: periodeApiNavn,
              }),
          },
          types: {
            block: BlockSerializer,
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter,
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
