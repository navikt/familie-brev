import React from "react";
import ListeFelter from "./Listefelter/ListeFelter";
import Flettefelter from "./flettefelter/Flettefelter";
import SubmalFelter from "./submalFelter/SubmalFelter";
import ValgFelter from "./Valgfelter/ValgFelter";
import { IDokumentVariabler } from "../../../server/sanity/DokumentVariabler";

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
