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
import { Feil } from '../../utils/Feil';
import type { UtbetalingerPerMndEøs } from '../../../typer/utbetalingerEøs';

interface IDelmalSerializerProps {
  sanityProps: any;
  dokumentData: IDokumentData | undefined;
  maalform: Maalform;
}

interface StyledDelmalWrapperProps {
  $skalBegynnePaaNySide: boolean;
}

const StyledDelmalWrapper = styled.div<StyledDelmalWrapperProps>`
  ${props =>
    props.$skalBegynnePaaNySide
      ? css`
          page-break-before: always;
        `
      : ''}
`;
const DelmalSerializer = (props: IDelmalSerializerProps) => {
  const { sanityProps, dokumentData, maalform } = props;
  const delmalData = dokumentData?.delmalData;
  const { delmalReferanse, skalAlltidMed, skalBegynnePaaNySide } = sanityProps.value;
  const delmalApiNavn = delmalReferanse.apiNavn as string;

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmalData || !delmalData[delmalApiNavn])) {
    return null;
  }

  const utbetalingerPerMndEøs = (
    dokumentData: IDokumentData | IDokumentDataMedUtbetalingerEøs | undefined,
  ): UtbetalingerPerMndEøs => {
    const utbetalingerPerMndEøs = (dokumentData as IDokumentDataMedUtbetalingerEøs)
      ?.utbetalingerPerMndEøs;
    if (!utbetalingerPerMndEøs) {
      throw new Feil(
        `Delmalen ${delmalApiNavn} skal inneholde tabell med utbetalinger, men feltet 'utbetalingerPerMndEøs' mangler.`,
        400,
      );
    }
    return utbetalingerPerMndEøs;
  };

  const flettefelter: Flettefelter | undefined = delmalData && delmalData[delmalApiNavn];

  return (
    <StyledDelmalWrapper $skalBegynnePaaNySide={skalBegynnePaaNySide} className={'delmal'}>
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
                utbetalingerPerMndEøs: utbetalingerPerMndEøs(dokumentData),
              }),
          },
        }}
      />
    </StyledDelmalWrapper>
  );
};

export default DelmalSerializer;
