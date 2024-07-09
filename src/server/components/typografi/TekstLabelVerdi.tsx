import React from 'react';

const TekstLabelVerdi: React.FC<{ label: string; verdi: string }> = ({ label, verdi }) => {
  return (
    <div
      style={{
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '18px',
        lineHeight: '24px',
        backgroundColor: 'red',
      }}
    >
      <p style={{ fontWeight: 600, margin: 0 }}>{label}:</p>
      <p style={{ fontWeight: 400, margin: 0 }}>{verdi}</p>
    </div>
  );
};

export default TekstLabelVerdi;
