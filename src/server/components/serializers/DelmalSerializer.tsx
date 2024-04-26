import React from 'react';
import type {
  Flettefelter,
  IDokumentData,
  IDokumentDataMedUtbetalingerEøs,
} from '../../../typer/dokumentApiBrev';
import FlettefeltSerializer from './FlettefeltSerializer';
import BlockSerializer from './BlockSerializer';
import type { Maalform } from '../../../typer/sanitygrensesnitt';
import LenkeSerializer from './LenkeSerializer';
import { PortableText } from '@portabletext/react';
import UtbetalingerSerializer from './UtbetalingerSerializer';
import { css, styled } from 'styled-components';

interface IDelmalSerializerProps {
  sanityProps: any;
  dokumentData: IDokumentData | undefined;
  maalform: Maalform;
}

interface StyledDelmalWrapperProps {
  $skalStartePaaNySide: boolean;
}

const StyledDelmalWrapper = styled.div<StyledDelmalWrapperProps>`
  ${props =>
    props.$skalStartePaaNySide
      ? css`
          page-break-before: always;
        `
      : ''}
`;
const DelmalSerializer = (props: IDelmalSerializerProps) => {
  const { sanityProps, dokumentData, maalform } = props;
  const { delmalData } = dokumentData as IDokumentData;
  const { delmalReferanse, skalAlltidMed, skalBegynnePaaNySide } = sanityProps.value;
  const delmalApiNavn = delmalReferanse.apiNavn as string;

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmalData || !delmalData[delmalApiNavn])) {
    return null;
  }

  const flettefelter: Flettefelter | undefined = delmalData && delmalData[delmalApiNavn];

  return (
    <StyledDelmalWrapper $skalStartePaaNySide={skalBegynnePaaNySide} className={'delmal'}>
      <PortableText
        value={delmalReferanse[maalform]}
        components={{
          block: BlockSerializer,
          marks: {
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter,
                dokumentApiNavn: delmalApiNavn,
              }),
            lenke: LenkeSerializer,
            hoyrestill: (props: any) => <span className={'høyrestill'}>{props.children}</span>,
          },
          types: {
            undefined: (_: any) => <div />,
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter,
                dokumentApiNavn: delmalApiNavn,
              }),
            utbetalinger: (_: any) =>
              UtbetalingerSerializer({
                maalform: maalform,
                utbetalingerPerMndEøs: (dokumentData as IDokumentDataMedUtbetalingerEøs)
                  .utbetalingerPerMndEøs,
              }),
          },
        }}
      />
    </StyledDelmalWrapper>
  );
};

export default DelmalSerializer;
