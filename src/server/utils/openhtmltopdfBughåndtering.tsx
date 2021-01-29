// Mellomrom på slutten av et inline html-element brekker rendringen i
// openhtmltopdf som blir brukt til å produsere PDFene
export const rightTrimLastProp = (props: any) => {
  const children: any[] = props.children;
  if (typeof children[children.length - 1] === 'string') {
    children[children.length - 1] = children[children.length - 1].trimRight();
  }
  return children;
};
