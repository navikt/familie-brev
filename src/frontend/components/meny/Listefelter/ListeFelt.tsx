import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import MenyVariabler from '../MenyVariabler';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Fareknapp, Knapp } from 'nav-frontend-knapper';
import { IDokumentVariabler } from '../../../../server/sanity/DokumentVariabler';

interface ListeFeltProps {
  liste: IDokumentVariabler[];
  navn: string;
  endreListeIDokumentVariabler: (listeNavn: string, liste: IDokumentVariabler[]) => void;
}

const ListeFelt = (props: ListeFeltProps) => {
  const { navn, liste, endreListeIDokumentVariabler } = props;
  const [pen, settÅpen] = useState(false);

  const endreListeVariabler = (index: number, dokumentVariabler: IDokumentVariabler) => {
    const nyListe = [...liste];
    nyListe[index] = dokumentVariabler;
    endreListeIDokumentVariabler(navn, nyListe);
  };

  const addListeElement = () => {
    const nyListe = [...liste];
    nyListe.push(nyListe[0]);
    endreListeIDokumentVariabler(navn, nyListe);
  };

  const slettListeElement = (index: number) => {
    const nyListe = [...liste];
    nyListe.splice(index, 1);
    endreListeIDokumentVariabler(navn, nyListe);
  };

  return (
    <>
      <EkspanderbartpanelBase tittel={navn} apen={pen} onClick={() => settÅpen(!pen)}>
        {liste.map((dokumentVariabler, index) => (
          <div key={index}>
            {index !== 0 ? <Separator /> : ''}
            <StyledListeHeader>
              <div>{navn + ' ' + (index + 1)}</div>
              {liste.length > 1 && (
                <Fareknapp mini={true} onClick={() => slettListeElement(index)}>
                  Slett
                </Fareknapp>
              )}
            </StyledListeHeader>

            <MenyVariabler
              settVariabler={(dokumentVariabler: IDokumentVariabler) =>
                endreListeVariabler(index, dokumentVariabler)
              }
              variabler={dokumentVariabler}
            />
          </div>
        ))}

        <Knapp
          id={`legg-til-liste-element-${navn}-${liste.length}`}
          onClick={addListeElement}
          spinner={false}
        >{`Legg til ${navn}`}</Knapp>
      </EkspanderbartpanelBase>
    </>
  );
};

const StyledListeHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  .slett {
    color: red;
  }
  .slett:hover {
    cursor: pointer;
  }
`;

const Separator = styled.hr`
  border-width: 1px;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

export default ListeFelt;
