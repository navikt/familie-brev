import { IDokumentVariabler } from './dokumentApi';
import { ISanityDelmalGrensesnitt, ISanityValgfeltGrensesnitt } from './sanitygrensesnitt';

export interface IDokumentVariablerMedMetadata extends IDokumentVariabler {
  valgfeltMetadata: { [valgFeltId: string]: ISanityValgfeltGrensesnitt };
  delmalMetadata: { [delmalId: string]: ISanityDelmalGrensesnitt };
}
