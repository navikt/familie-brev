import React from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering';

const settTag = (node: any) => {
  const style = node.style;

  if (RegExp('/?h[1-6]').test(style)) {
    return style;
  }

  return 'div';
};

export const BlockSerializer = (props: any): JSX.Element => {
  const children = rightTrimLastProp(props);

  const Tag = settTag(props.value);

  return (
    <Tag style={{ minHeight: '1rem' }} className={`block`}>
      {children}
    </Tag>
  );
};
