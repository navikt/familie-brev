import React from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering';

const lenkeSerializer = (props: any) => {
  const children = rightTrimLastProp(props);
  return <span className={'lenke'}>{children}</span>;
};

export default lenkeSerializer;
