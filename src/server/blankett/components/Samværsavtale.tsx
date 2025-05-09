import React from 'react';
import { BeregnetSamvær } from '../../../typer/dokumentApiBlankett';
import { utledDeloverskrift } from '../../lagManueltBrevHtml';

interface Props {
  beregnetSamvær: BeregnetSamvær;
}

export const Samværsavtale: React.FC<Props> = ({ beregnetSamvær }) => (
  <div className={'blankett-samværsavtale'}>
    {beregnetSamvær.uker.map(avsnitt => (
      <>
        {avsnitt.deloverskrift && utledDeloverskrift(avsnitt)}
        {avsnitt.innhold && <p style={{ whiteSpace: 'pre-wrap' }}>{avsnitt.innhold}</p>}
      </>
    ))}
    <div>{beregnetSamvær.oppsummering}</div>
  </div>
);
