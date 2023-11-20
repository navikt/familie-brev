import React from 'react';
import { avslagÅrsakTilTekst, type IAvslåVedtak } from '../../../typer/dokumentApiBlankett';

export const AvslåVedtak: React.FC<IAvslåVedtak> = ({ avslåÅrsak, avslåBegrunnelse }) => {
  return (
    <div className={'blankett-page-break'}>
      <h2>Vedtak</h2>
      <h3 className={'blankett'}>Resultat</h3>
      <div>Avslå</div>
      <h4 className={'blankett'}>Årsak</h4>
      <p>{avslagÅrsakTilTekst[avslåÅrsak]}</p>
      <h4 className={'blankett'}>Begrunnelse</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>{avslåBegrunnelse}</p>
    </div>
  );
};
