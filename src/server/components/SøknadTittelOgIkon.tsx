import React from 'react';
import { Heading } from './typografi/Heading';
import type { ISøknad } from '../../typer/dokumentApiBrev';
import { dagensDatoTidFormatert } from '../utils/util';
import { NavIkon } from './ikoner/navIkon';

export const SøknadTittelOgIkon: React.FC<{ søknad: ISøknad }> = ({ søknad }) => {
  const labelUtenBrevkode = søknad.label.replace(/\s*\(.*?\)\s*/g, '');
  const brevkode = søknad.label.match(/\((.*?)\)/)?.[1] || '';

  return (
    <div className={'header'}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
        <tr>
          <td style={{ verticalAlign: 'middle', border: 'none' }}>
            <div>
              <Heading size={'large'} text={labelUtenBrevkode} />

              <div
                style={{
                  fontSize: '18px',
                  lineHeight: '24px',
                }}
              >
                <p style={{ margin: 0 }}>{brevkode}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600 }}>Sendt inn:</span> {dagensDatoTidFormatert()}
                </p>
              </div>
            </div>
          </td>
          <td
            style={{
              width: '1%',
              whiteSpace: 'nowrap',
              verticalAlign: 'middle',
              border: 'none',
            }}
          >
            <NavIkon />
          </td>
        </tr>
      </table>
    </div>
  );
};
