import { IDokumentVariabler } from "../../utils/DokumentVariabler";
import React from "react";
import ListeFelter from "./Listefelter/ListeFelter";
import Flettefelter from "./flettefelter/Flettefelter";
import SubmalFelter from "./submalFelter/SubmalFelter";
import ValgFelter from "./Valgfelter/ValgFelter";

export default function (props: {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}) {
  const { variabler, settVariabler } = props;

  return (
    <div>
      <ValgFelter variabler={variabler} settVariabler={settVariabler} />
      <Flettefelter variabler={variabler} settVariabler={settVariabler} />
      <SubmalFelter variabler={variabler} settVariabler={settVariabler} />
      <ListeFelter variabler={variabler} settVariabler={settVariabler} />
    </div>
  );
}

//<Element className="label">{flettefelt}</Element>

const StyledFlettefelt = styled.div`
  margin-top: 20px;

  .label {
    text-transform: capitalize;
    margin-bottom: 0.5rem;
  }
`;
