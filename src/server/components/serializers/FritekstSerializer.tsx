import React from 'react';
import { styled } from 'styled-components';
import { IDokumentData, IDokumentDataMedFritekst } from '../../../typer/dokumentApiBrev';

interface Props {
  dokumentData: IDokumentData | undefined;
}

const StyledDiv = styled.div`
  white-space: pre-wrap;
`;

export const FritekstSerializer: React.FC<Props> = ({ dokumentData }) => {
  const dokumentDataHarFritekst = (dokumentData: any): dokumentData is IDokumentDataMedFritekst =>
    (dokumentData as IDokumentDataMedFritekst)?.fritekst !== undefined;

  if (!dokumentDataHarFritekst(dokumentData)) {
    return null;
  }

  return dokumentData.fritekst
    .split('\n')
    .map((avsnitt, index) =>
      avsnitt.length > 0 ? <StyledDiv key={index}>{avsnitt}</StyledDiv> : <br key={index} />,
    );
};
