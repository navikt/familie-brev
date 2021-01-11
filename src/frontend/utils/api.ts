import axios, { AxiosResponse } from 'axios';
import { IDokumentVariabler } from '../../typer/dokumentApi';
import { Datasett } from '../../server/sanity/sanityClient';
import { ISanityGrensesnitt, Maalform } from '../../typer/sanitygrensesnitt';

export const hentHtml = async (
  datasett: Datasett,
  maalform: Maalform,
  dokumentId: string,
  dokumentVariabler: IDokumentVariabler,
): Promise<string> => {
  const url = `${process.env.REACT_APP_BACKEND}/api/${datasett}/${maalform}/${dokumentId}/html`;
  return (await axios.post<string>(url, dokumentVariabler)).data;
};

export const hentGrensesnittFraBackend = async (
  datasett: Datasett,
  maalform?: Maalform,
  dokumentId?: string,
): Promise<ISanityGrensesnitt[]> => {
  const url = `${process.env.REACT_APP_BACKEND}/api/${datasett}/grensesnitt?maalform=${maalform}&dokumentId=${dokumentId}`;
  return (await axios.get(url)).data;
};

export const genererPdf = async (html: string): Promise<Uint8Array | Blob> => {
  const url = `${process.env.REACT_APP_FAMILIE_DOKUMENT}/api/html-til-pdf`;

  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/pdf',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => new Blob([res.data], { type: 'application/pdf' }));
};
