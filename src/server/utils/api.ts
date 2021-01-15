import axios, { AxiosResponse } from 'axios';

export const genererPdf = async (html: string): Promise<ArrayBuffer> => {
  const url = `${process.env.REACT_APP_FAMILIE_DOKUMENT}/api/html-til-pdf`;

  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/pdf',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => res.data);
};
