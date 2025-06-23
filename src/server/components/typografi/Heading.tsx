import React from 'react';

type HeadingProps = {
  size: 'large' | 'medium' | 'small';
  text: string;
};

export const Heading: React.FC<HeadingProps> = ({ size, text }) => {
  const HeadingTag = size === 'large' ? 'h1' : size === 'medium' ? 'h2' : 'h3';

  let headingStyle: React.CSSProperties = {};

  switch (size) {
    case 'large':
      headingStyle = {
        fontSize: '32px',
        fontWeight: '600',
        lineHeight: '40px',
      };
      break;
    case 'medium':
      headingStyle = {
        fontSize: '24px',
        fontWeight: '600',
        lineHeight: '32px',
      };
      break;
    case 'small':
      headingStyle = {
        fontSize: '20px',
        fontWeight: '600',
        lineHeight: '28px',
        textDecoration: 'underline',
      };
      break;
    default:
      break;
  }

  return React.createElement(HeadingTag, { style: headingStyle }, text);
};
