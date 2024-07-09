import React from 'react';

const TekstLabelVerdi: React.FC<{ label: string; verdi: string; alternativer?: string }> = ({
  label,
  verdi,
  alternativer,
}) => {
  return (
    <div
      style={{
        fontSize: '18px',
        lineHeight: '24px',
        marginLeft: '1rem',
        marginTop: '1rem',
      }}
    >
      <p style={{ fontWeight: 600, margin: 0 }}>{label.endsWith('?') ? label : `${label}:`}</p>
      {alternativer && (
        <p
          style={{
            fontWeight: 400,
            margin: 0,
            fontStyle: 'italic',
            fontSize: '14px',
            lineHeight: '20px',
          }}
        >
          {alternativer}
        </p>
      )}
      <p style={{ fontWeight: 400, margin: 0 }}>{verdi}</p>
    </div>
  );
};

export default TekstLabelVerdi;
