import React from 'react';
import { BeregnetSamvær } from '../../../typer/dokumentApiBlankett';
import { utledDeloverskrift } from '../../lagManueltBrevHtml';

interface Props {
  beregnetSamvær: BeregnetSamvær;
}

export const Samværsavtale: React.FC<Props> = ({ beregnetSamvær }) => (
  <>
    <div>
      <strong>Samværsberegning</strong>
    </div>
    {beregnetSamvær.uker.map(avsnitt => (
      <>
        {avsnitt.deloverskrift && utledDeloverskrift(avsnitt)}
        {avsnitt.innhold && <p style={{ whiteSpace: 'pre-wrap' }}>{avsnitt.innhold}</p>}
      </>
    ))}
    <div className={'blankett-samværsavtale-oppsummering'}>{beregnetSamvær.oppsummering}</div>
  </>
);
