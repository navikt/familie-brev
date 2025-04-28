import React from 'react';

interface Props {
  saksbehandlersignatur: string;
  besluttersignatur?: string;
  navEnhet: string;
}

export const SaksbehandlerSignatur: React.FC<Props> = ({
  saksbehandlersignatur,
  besluttersignatur,
  navEnhet,
}) => (
  <div>
    <p style={{ float: 'left' }}>
      {besluttersignatur && (
        <span
          style={{
            display: 'inline-block',
            marginRight: '70px',
          }}
        >
          <span
            style={{
              display: 'block',
            }}
          >
            {besluttersignatur.trim()}
          </span>
          <span>{navEnhet}</span>
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
        <span>{navEnhet}</span>
      </span>
    </p>
  </div>
);
