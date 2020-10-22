import React from "react";
import styled from "styled-components";
import { RadioGruppe, Radio } from "nav-frontend-skjema";
import { Select } from 'nav-frontend-skjema';
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';

const StyledMeny = styled.div`
    height: 1300px;
    width: 320px;
    z-index: 10;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: #fff;
    padding-top: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    display: flex;
    flex-direction: column;

    hr {
        border-width: 1px;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .meny-innhold {
        margin-left: 2rem;
        margin-right: 2rem;

        .meny-element {
            margin-top: 2rem;
            margin-bottom: 2rem;
        }
    }
`

const StyledHovedknapp = styled(Hovedknapp)`
    margin-top: 4rem;
    margin-bottom: 2rem;
`;

function Meny() {
  return (
    <StyledMeny>
        <div className="meny-innhold">
        <div className="meny-element">
            <Select label="Brevtype">
                <option value="norge">Vedtak om innvilgelse</option>
                <option value="sverige">Vedtak om blabla</option>
                <option value="danmark">Test jaja</option>
            </Select>
        </div>
        <hr></hr>
        <div className="meny-element">
        <Select label="Startdato begrunnelse">
            <option value="norge">Søknad om separasjon</option>
            <option value="sverige">Test</option>
            <option value="danmark">Test jaja</option>
        </Select>
        </div>
        <div className="meny-element">
        <Select label="Sluttdato begrunnelse">
            <option value="norge">Brukt 3 år</option>
            <option value="sverige">Test</option>
            <option value="danmark">Test jaja</option>
        </Select>
        </div>
        <hr></hr>
        <Select label="Inntektskategori">
            <option value="norge">Varierende inntekt</option>
            <option value="sverige">Test</option>
            <option value="danmark">Test jaja</option>
        </Select>
        <div className="meny-element">
        <RadioGruppe legend="Inntektstype">
            <Radio label={"Kun arbeidsinntekt"} name="arbeidsinntekt" />
            <Radio label={"Arbeidsinntekt og annen stønad"} name="arbeid_og_annen" />
            <Radio label={"Kun annen stønad"} name="annen" />
        </RadioGruppe>
        </div>
        <div className="meny-element">
        <Input label="Antall måneder etterbetaling" />
        </div>
        <div className="meny-element">
        <RadioGruppe legend="Beregningsgrunnlag fremover">
            <Radio label={"Gjennomsnitt av flere måneder"} name="gjsnitt" />
            <Radio label={"Én måned"} name="en_maned" />
            <Radio label={"Arbeidskonktrakt"} name="arbeidskontrakt" />
            <Radio label={"Starter på ytelse"} name="starter" />
        </RadioGruppe>
        <StyledHovedknapp>Sett opp brev</StyledHovedknapp>
        </div>
        </div>
    </StyledMeny>
  );
}

export default Meny;
