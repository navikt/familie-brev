import React from 'react';

interface Props {
  saksbehandlersignatur: string;
  saksbehandlerEnhet?: string;
  besluttersignatur?: string;
  beslutterEnhet?: string;
}

export const SaksbehandlerSignatur: React.FC<Props> = ({
  saksbehandlersignatur,
  saksbehandlerEnhet,
  besluttersignatur,
  beslutterEnhet,
}) => (
  <div>
    <p style={{ float: 'left' }}>
      {besluttersignatur && (
        <span
          style={{
            display: 'inline-block',
            marginRight: '140px',
          }}
        >
          <span
            style={{
              display: 'block',
            }}
          >
            {besluttersignatur.trim()}
          </span>
          <span>{beslutterEnhet ?? 'Nav arbeid og ytelser'}</span>
        </span>
      )}
      <span style={{ display: 'inline-block' }}>
        <span
          style={{
            display: 'block',
          }}
        >
          {saksbehandlersignatur}
        </span>
        <span>{saksbehandlerEnhet ?? 'Nav arbeid og ytelser'}</span>
      </span>
    </p>
  </div>
);
