import React from 'react';
import SubmalFelter from './submalFelter/SubmalFelter';
import ValgFelter from './Valgfelter/ValgFelter';
import { IDokumentVariablerMedMetadata } from '../../../typer/dokumentFrontend';

export default function (props: {
  variabler: IDokumentVariablerMedMetadata;
  settVariabler: (dokumentvariabler: IDokumentVariablerMedMetadata) => void;
}) {
  const { variabler, settVariabler } = props;

  return (
    <div>
      <ValgFelter variabler={variabler} settVariabler={settVariabler} />
      <SubmalFelter variabler={variabler} settVariabler={settVariabler} />
    </div>
  );
}
