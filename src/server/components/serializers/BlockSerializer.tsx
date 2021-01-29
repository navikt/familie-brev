import React from 'react';

const settTag = (node: any) => {
  const style = node.style;

  if (RegExp('/?h[1-6]').test(style)) {
    return style;
  }

  return 'div';
};

const BlockSerializer = (props: any) => {
  // Mellomrom på slutten av et inline html-element brekker rendringen i
  // openhtmltopdf som blir brukt til å produsere PDFene
  const children: any[] = props.children;
  if (typeof children[children.length - 1] === 'string') {
    children[children.length - 1] = children[children.length - 1].trimRight();
  }
  const Tag = settTag(props.node);

  return (
    <Tag style={{ minHeight: '1rem' }} className={`block`}>
      {children}
    </Tag>
  );
};

export default BlockSerializer;
