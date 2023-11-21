import React from 'react';
import type { IFritekstområder } from '../../../typer/dokumentApiBrev';

interface IFritekstområdeSerializerProps {
  sanityProps: any;
  fritekstområder?: IFritekstområder;
}

export const FritekstområdeSerializer = (props: IFritekstområdeSerializerProps) => {
  const { sanityProps, fritekstområder } = props;

  if (!fritekstområder) return null;

  const uuid = sanityProps.value._key;
  const avsnitt = fritekstområder[uuid];

  return (
    <div>
      {avsnitt &&
        avsnitt.map((avsnitt, index) => (
          <p key={index}>
            {avsnitt.deloverskrift && <strong>{avsnitt.deloverskrift} </strong>}
            {avsnitt.deloverskrift && <br />}
            {avsnitt.innhold && <span style={{ whiteSpace: 'pre-wrap' }}>{avsnitt.innhold}</span>}
          </p>
        ))}
    </div>
  );
};
