import React from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering';

const settTag = (node: any) => {
  const style = node.style;

  if (RegExp('/?h[1-6]').test(style)) {
    return style;
  }

  return 'div';
};

const BlockSerializer = (props: any) => {
  const children = rightTrimLastProp(props);

  const Tag = settTag(props.node);

  return (
    <Tag style={{ minHeight: '1rem' }} className={`block`}>
      {children}
    </Tag>
  );
};

export default BlockSerializer;
