import React, { useState } from "react";
import styled from "styled-components";
import { RadioGruppe, Radio } from "nav-frontend-skjema";
import { Select } from 'nav-frontend-skjema';
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { CheckboksPanel } from 'nav-frontend-skjema';

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

interface MenyProps {
    settDokumentNavn: any;
    dokumentNavn: string;
}

function Meny(props: MenyProps) {
    const [antallMndEtterbetaling, settAntallMndEtterbetaling] = useState("");
    const [inntektstype, settInntektstype] = useState("");

    const { settDokumentNavn, dokumentNavn } = props;

    const [tempDokumentNavn, settTempDokumentNavn] = useState(dokumentNavn);
    const [tempEtterbetaling, settTempEtterbetaling] = useState(false);

    const settInntektstypeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        settInntektstype(e.target.name);
    }

    const settOppBrev = () => {
        settDokumentNavn(tempDokumentNavn);
    }

    return (
        <StyledMeny>
            <div className="meny-innhold">
            <div className="meny-element">
                <Select value={tempDokumentNavn} label="Brevtype" onChange={(e) => {
                    settTempDokumentNavn(e.target.value);
                }}>
                    <option value="Innvilgelse">Vedtak om innvilgelse</option>
                    <option value="Barnetrygd">Du får barnetrygd</option>
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
            <div className="meny-element">
            <Select label="Inntektskategori">
                <option value="norge">Varierende inntekt</option>
                <option value="sverige">Test</option>
                <option value="danmark">Test jaja</option>
            </Select>
            </div>
            <div className="meny-element">
                <CheckboksPanel onChange={() => settTempEtterbetaling(!tempEtterbetaling)} checked={tempEtterbetaling} label="Er detterbetaling?" />
            </div>
            <div className="meny-element">
            <RadioGruppe legend="Inntektstype">
                <Radio label={"Kun arbeidsinntekt"} name="arbeidsinntekt" checked={inntektstype=="arbeidsinntekt"} onChange={settInntektstypeRadio} />
                <Radio label={"Arbeidsinntekt og annen stønad"} name="arbeid_og_annen" checked={inntektstype=="arbeid_og_annen"} onChange={settInntektstypeRadio}  />
                <Radio label={"Kun annen stønad"} name="annen" checked={inntektstype=="annen"} onChange={settInntektstypeRadio}  />
            </RadioGruppe>
            </div>
            <div className="meny-element">
            <Input label="Antall måneder etterbetaling" value={antallMndEtterbetaling} onChange={(e) => {
                settAntallMndEtterbetaling(e.target.value);
            }} />
            </div>
            <div className="meny-element">
            <RadioGruppe legend="Beregningsgrunnlag fremover">
                <Radio label={"Gjennomsnitt av flere måneder"} name="gjsnitt" />
                <Radio label={"Én måned"} name="en_maned" />
                <Radio label={"Arbeidskonktrakt"} name="arbeidskontrakt" />
                <Radio label={"Starter på ytelse"} name="starter" />
            </RadioGruppe>
            <StyledHovedknapp onClick={settOppBrev}>Sett opp brev</StyledHovedknapp>
            </div>
            </div>
        </StyledMeny>
    );
}

export default Meny;
