const formaterTilCamelCase = (id: string): string => {
  let lowercaseId = id.toLowerCase();
  lowercaseId = fjernNorskeBokstaver(lowercaseId);
  lowercaseId = fjernUgyldigeBokstaver(lowercaseId);
  lowercaseId = strip(lowercaseId);
  return lowerCaseTilCamelCase(lowercaseId);
};

const fjernUgyldigeBokstaver = (tekst: string) => tekst.replace(/[^\w\s]/gi, '');

const fjernNorskeBokstaver = (tekst: string): string =>
  tekst.replace(/ø/g, 'o').replace(/å/g, 'aa').replace(/æ/g, 'ae');

const lowerCaseTilCamelCase = (lowerCase: string) =>
  lowerCase
    .split(' ')
    .map((idElement, index) => {
      if (idElement.length === 0) {
        return '';
      }
      return index === 0
        ? idElement.toLowerCase()
        : idElement[0].toUpperCase() + idElement.slice(1).toLowerCase();
    })
    .join('');

const strip = (tekst: string) => {
  return String(tekst).replace(/^\s+|\s+$/g, '');
};

export default formaterTilCamelCase;
