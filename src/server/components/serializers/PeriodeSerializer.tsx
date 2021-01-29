import React from 'react';
import { Flettefelter, IPeriodeData } from '../../../typer/dokumentApi';
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
  periodeData: IPeriodeData;
  maalform: Maalform;
  datasett: Datasett;
  forelderApiNavn: string;
}

const PeriodeSerializer = (props: IPeriodeProps) => {
  const { periodeData, maalform, datasett, forelderApiNavn } = props;
  // Om delmalen hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en delmalBlock finnes den i props.node.

  validerPeriode(forelderApiNavn, periodeData);

  return (
    <div className={`delmal`}>
      {Object.keys(periodeData).map(periodeApiNavn => (
        <Periode
          key={periodeApiNavn}
          datasett={datasett}
          maalform={maalform}
          periodeApiNavn={periodeApiNavn}
          flettefelter={periodeData[periodeApiNavn]}
        />
      ))}
    </div>
  );
};

const Periode = (props: {
  maalform: Maalform;
  periodeApiNavn: string;
  datasett: Datasett;
  flettefelter: Flettefelter;
}) => {
  const { maalform, periodeApiNavn, datasett, flettefelter } = props;

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
    </div>
  );
};

export default PeriodeSerializer;
