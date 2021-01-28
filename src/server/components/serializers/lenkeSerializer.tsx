import React from 'react';
import { rightTrimLastProp } from '../../utils/openhtmltopdfBughåndtering';

const lenkeSerializer = (props: any) => {
  const children = rightTrimLastProp(props);
  return (
    <a href={children[0]} className={'lenke'}>
      {children}
    </a>
  );
};

export default lenkeSerializer;
