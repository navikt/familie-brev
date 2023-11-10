import React from 'react';

export const Begrunnelse: React.FC<{
  begrunnelse?: string;
}> = ({ begrunnelse }) => {
  return (
    <>
      <h4>Begrunnelse</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>{begrunnelse}</p>
    </>
  );
};
