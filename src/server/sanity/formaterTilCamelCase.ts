const formaterTilCamelCase = (id: string): string => {
  let lowercaseId = id.toLowerCase();
  lowercaseId = fjernNorskeBokstaver(lowercaseId);
  lowercaseId = fjernUgyldigeBokstaver(lowercaseId);
  lowercaseId = strip(lowercaseId);
  return lowerCaseTilCamelCase(lowercaseId);
};

const fjernUgyldigeBokstaver = (tekst: string) =>
  tekst.replace(/[^\w\s]/gi, "");

const fjernNorskeBokstaver = (tekst: string): string =>
  tekst.replace("ø", "o").replace("å", "aa").replace("æ", "ae");

const lowerCaseTilCamelCase = (lowerCase: string) =>
  lowerCase
    .split(" ")
    .map((idElement, index) =>
      index === 0
        ? idElement.toLowerCase()
        : idElement[0].toUpperCase() + idElement.slice(1).toLowerCase()
    )
    .join("");

const strip = (tekst: string) => {
  return String(tekst).replace(/^\s+|\s+$/g, "");
};

export default formaterTilCamelCase;
