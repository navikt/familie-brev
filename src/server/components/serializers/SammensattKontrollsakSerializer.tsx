import React from 'react';
import { styled } from 'styled-components';
import type {
  IDokumentData,
  IDokumentDataSammensattKontrollsak,
} from '../../../typer/dokumentApiBrev';

interface Props {
  dokumentData: IDokumentData | undefined;
}

const StyledParagraph = styled.p`
  white-space: pre-wrap;
`;
export const SammensattKontrollsakSerializer: React.FC<Props> = ({ dokumentData }) => {
  const erIDokumentDataSammensattKontrollsak = (
    dokumentData: IDokumentData | IDokumentDataSammensattKontrollsak | undefined,
  ): dokumentData is IDokumentDataSammensattKontrollsak => {
    return (
      (dokumentData as IDokumentDataSammensattKontrollsak)?.sammensattKontrollsakFritekst !==
      undefined
    );
  };

  if (!erIDokumentDataSammensattKontrollsak(dokumentData)) {
    return null;
  }

  const fritekst = dokumentData.sammensattKontrollsakFritekst;

  const fritekstAvsnitt = fritekst.split('\n\n');

  return fritekstAvsnitt.map((avsnitt, index) => (
    <StyledParagraph key={index}>{avsnitt}</StyledParagraph>
  ));
};
