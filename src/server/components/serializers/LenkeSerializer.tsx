import React from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering.js';

export const LenkeSerializer = (props: any) => {
  const children = rightTrimLastProp(props);
  return <span className={'lenke'}>{children}</span>;
};
