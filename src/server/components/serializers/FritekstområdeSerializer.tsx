import React from 'react';
import type { IFritekstområder } from '../../../typer/dokumentApi';

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
      {avsnitt.map((avsnitt, indeks) => (
        <div key={uuid + indeks}>{avsnitt.innhold}</div>
      ))}
    </div>
  );
};
