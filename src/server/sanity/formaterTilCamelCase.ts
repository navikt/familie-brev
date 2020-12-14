const formaterTilCamelCase = (id: string): string => {
  let lowercaseId = id.toLowerCase();
  lowercaseId = lowercaseId
    .replace("ø", "o")
    .replace("å", "aa")
    .replace("æ", "ae")
    .replace(/[^\w\s]/gi, "");
  let camelCaseId = lowercaseId
    .split(" ")
    .map((idElement, index) =>
      index === 0
        ? idElement.toLowerCase()
        : idElement[0].toUpperCase() + idElement.slice(1).toLowerCase()
    )
    .join("");
  return camelCaseId;
};

export default formaterTilCamelCase;
