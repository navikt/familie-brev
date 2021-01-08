import { RadioPanelGruppe } from 'nav-frontend-skjema';
import MenyVariabler from '../MenyVariabler';
import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { IValgfelt } from '../../../../typer/dokumentApi';
import { camelCaseTilVanligTekst } from '../../../utils/camelCaseTilVanligTekst';
import {
  ISanityValgfeltGrensesnitt,
  ISanityValgmulighet,
} from '../../../../typer/sanitygrensesnitt';
import lagPlaceholderVariabler from '../../../utils/lagPlaceholderVariabler';
import { IDokumentVariablerMedMetadata } from '../../../../typer/dokumentFrontend';

interface ValgFeltProps {
  valgfelt: IValgfelt;
  valgfeltgrensesnitt: ISanityValgfeltGrensesnitt;
  navn: string;
  endreValgfeltIDokumentVariabler: (valgfeltNavn: string, valgfelt: IValgfelt) => void;
}

function ValgFelt(props: ValgFeltProps) {
  const { navn, valgfelt, endreValgfeltIDokumentVariabler, valgfeltgrensesnitt } = props;

  const endreValgFeltVariabler = (valgfeltVariabler: IDokumentVariablerMedMetadata) => {
    const nyttValgFelt: IValgfelt = {
      valg: [{ navn: valgfelt.valg[0].navn, dokumentVariabler: valgfeltVariabler }],
      erGjentagende: false,
    };

    endreValgfeltIDokumentVariabler(navn, nyttValgFelt);
  };

  const endreValg = (valgnavn: string) => {
    const sanityValgmulighet:
      | ISanityValgmulighet
      | undefined = valgfeltgrensesnitt.valgmuligheter.find(
      valgmulighet => valgmulighet.valgnavn === valgnavn,
    );
    if (!sanityValgmulighet) {
      throw new Error('fant ikke valgmulighet');
    }

    const nyeVariabler: IDokumentVariablerMedMetadata = lagPlaceholderVariabler(
      sanityValgmulighet.grensesnitt,
    );

    const nyttValgFelt: IValgfelt = {
      valg: [{ navn: valgnavn, dokumentVariabler: nyeVariabler }],
      erGjentagende: false,
    };
    endreValgfeltIDokumentVariabler(navn, nyttValgFelt);
  };

  return (
    <>
      <StyledValgHeader>{camelCaseTilVanligTekst(navn)}</StyledValgHeader>
      {
        <RadioPanelGruppe
          name={camelCaseTilVanligTekst(navn)}
          radios={valgfeltgrensesnitt.valgmuligheter.map(({ valgnavn }) => ({
            checked: valgnavn === valgfelt.valg[0].navn,
            onChange: _ => endreValg(valgnavn),
            label: camelCaseTilVanligTekst(valgnavn),
            name: navn,
          }))}
          onChange={_ => undefined}
        />
      }
      <MenyVariabler
        settVariabler={endreValgFeltVariabler}
        variabler={valgfelt.valg[0].dokumentVariabler as IDokumentVariablerMedMetadata}
      />
    </>
  );
}

const StyledValgHeader = styled(Element)`
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

export default ValgFelt;
