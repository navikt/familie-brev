import React from 'react';

interface Props {
  saksbehandlersignatur: string;
  besluttersignatur?: string;
  skjulBeslutterSignatur?: boolean;
  navEnhet: string;
}

export const SaksbehandlerSignatur: React.FC<Props> = ({
  saksbehandlersignatur,
  besluttersignatur,
  skjulBeslutterSignatur,
  navEnhet,
}) => (
  <div>
    <p style={{ float: 'left' }}>
      {!skjulBeslutterSignatur && (
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
            {besluttersignatur?.trim()}
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
