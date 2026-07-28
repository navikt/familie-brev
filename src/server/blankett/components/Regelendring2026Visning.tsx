import React from 'react';
import { EStønadType } from '../../../typer/dokumentApiBlankett';

export const Regelendring2026Visning: React.FC<{
  erRegelendring2026: boolean;
  featureToggleRegelendringer2026: boolean;
  regelendring2026Begrunnelse?: string;
  stønadstype: EStønadType;
}> = ({
  erRegelendring2026,
  featureToggleRegelendringer2026,
  regelendring2026Begrunnelse,
  stønadstype,
}) => {
  const skalVise =
    featureToggleRegelendringer2026 &&
    (stønadstype === EStønadType.OVERGANGSSTØNAD || stønadstype === EStønadType.BARNETILSYN);

  if (!skalVise) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <div>
        <strong>Regelverk: </strong>
        {erRegelendring2026 ? 'Nytt regelverk fra 01.07.2026' : 'Gammelt regelverk før 01.07.2026'}
      </div>
      {regelendring2026Begrunnelse && (
        <div>
          <strong>Begrunnelse for valg av regelverk: </strong>
          {regelendring2026Begrunnelse}
        </div>
      )}
    </div>
  );
};
