import React from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering';

const LenkeSerializer = (props: any) => {
  const children = rightTrimLastProp(props);
  return <span className={'lenke'}>{children}</span>;
};

export default LenkeSerializer;
