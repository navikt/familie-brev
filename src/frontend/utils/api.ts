import axios, { AxiosResponse } from "axios";
import { IDokumentVariabler } from "../../server/sanity/DokumentVariabler";
import {
  IGrensesnitt,
  Maalform,
} from "../../server/sanity/hentGrenesnittFraDokument";
import { Datasett } from "../../server/sanity/sanityClient";

export const hentHtml = async (
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett
): Promise<AxiosResponse<string>> => {
  const url = `${process.env.REACT_APP_BACKEND}/${datasett}/${maalform}/${dokumentId}/html`;
  return axios.post(url, dokumentVariabler);
};

export const hentGrensesnitt = async (
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett
): Promise<AxiosResponse<IGrensesnitt[]>> => {
  const url = `${process.env.REACT_APP_BACKEND}/${datasett}/grensesnitt?maalform=${maalform}&dokkumentId=${dokumentId}`;
  return await axios.get(url);
};

export const genererPdf = async (html: string): Promise<Uint8Array | Blob> => {
  const url = `${process.env.REACT_APP_FAMILIE_DOKUMENT}/api/html-til-pdf`;

  return axios
    .post(url, html, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    })
    .then(
      (res: AxiosResponse<ArrayBuffer>) =>
        new Blob([res.data], { type: "application/pdf" })
    );
};
