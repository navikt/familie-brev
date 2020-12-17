import React, { ChangeEvent } from "react";
import { Input } from "nav-frontend-skjema";
import styled from "styled-components";
import { Element } from "nav-frontend-typografi";
import { IDokumentVariabler } from "../../../../server/sanity/DokumentVariabler";

function Flettefelter(props: {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}) {
  const { variabler, settVariabler } = props;
  const { flettefelter } = variabler;

  function endreFlettefeltIDokumentVariabler(
    flettefelt: string,
    verdi: string
  ): IDokumentVariabler {
    return {
      ...variabler,
      flettefelter: { ...variabler.flettefelter, [flettefelt]: verdi },
    };
  }
  const endreFlettefelt = (
    e: ChangeEvent<HTMLInputElement>,
    flettefelt: string
  ) => {
    const nyeVariabler = endreFlettefeltIDokumentVariabler(
      flettefelt,
      e.target.value
    );
    settVariabler(nyeVariabler);
  };

  return (
    <div>
      {Object.keys(flettefelter).map((flettefelt) => (
        <StyledFlettefelt key={flettefelt}>
          <Element className="label">{flettefelt}</Element>
          <Input
            type="text"
            value={flettefelter[flettefelt]}
            alt={flettefelter.fletteFelt}
            placeholder={flettefelter.fletteFelt}
            onChange={(e) => endreFlettefelt(e, flettefelt)}
          />
        </StyledFlettefelt>
      ))}
    </div>
  );
}

const StyledFlettefelt = styled.div`
  margin-top: 20px;

  .label {
    text-transform: capitalize;
    margin-bottom: 0.5rem;
  }
`;

export default Flettefelter;
