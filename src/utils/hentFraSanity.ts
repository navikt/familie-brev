import { client, Datasett } from "./sanity";

async function hentFraSanity(query: string, datasett: Datasett) {
  const key = datasett + ";" + query;
  const cachedHits = sessionStorage.getItem(key);
  if (cachedHits) {
    return JSON.parse(cachedHits);
  } else {
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        sessionStorage.setItem(key, JSON.stringify(res));
        return res;
      });
  }
}

export default hentFraSanity;
