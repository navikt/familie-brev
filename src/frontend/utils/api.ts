import axios, { AxiosResponse } from "axios";

export async function genererPdf(html: string): Promise<Uint8Array | Blob> {
  const url = `http://${process.env.REACT_APP_FAMILIE_DOKUMENT}/api/html-til-pdf`;

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
}
