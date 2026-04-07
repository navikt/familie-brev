import React, { JSX } from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering';

const settTag = (node: any): keyof JSX.IntrinsicElements => {
  const style = node.style;

  if (RegExp('/?h[1-6]').test(style)) {
    return style;
  }

  return 'div';
};

export const BlockSerializer = (props: any): JSX.Element => {
  const children = rightTrimLastProp(props);
  const tag = settTag(props.value);

  return React.createElement(tag, { style: { minHeight: '1rem' }, className: 'block' }, children);
};
