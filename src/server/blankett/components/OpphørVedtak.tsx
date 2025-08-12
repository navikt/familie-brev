import React from 'react';
import { IOpphørVedtak, opphørÅrsakTilTekst } from '../../../typer/dokumentApiBlankett';

export const OpphørVedtak: React.FC<IOpphørVedtak> = ({ opphørÅrsak, opphørBegrunnelse }) => {
  return (
    <div className={'blankett-page-break'}>
      <h2>Vedtak</h2>
      <h3 className={'blankett'}>Resultat</h3>
      <div>Avslå</div>
      <h4 className={'blankett'}>Årsak</h4>
      <p>{opphørÅrsakTilTekst[opphørÅrsak]}</p>
      <h4 className={'blankett'}>Begrunnelse</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>{opphørBegrunnelse}</p>
    </div>
  );
};
