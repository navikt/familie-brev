import { client } from "./sanity";

async function hentFraSanity(query: string) {
  const cachedHits = sessionStorage.getItem(query);
  if (cachedHits) {
    return JSON.parse(cachedHits);
  } else {
    return client.fetch(query).then((res: any) => {
      sessionStorage.setItem(query, JSON.stringify(res));
      return res;
    });
  }
}

export default hentFraSanity;
