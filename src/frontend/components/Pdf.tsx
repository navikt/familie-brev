import { Document, Page } from "react-pdf";
import React, { useState } from "react";
import styled from "styled-components";

interface PdfProps {
  pdf: Uint8Array | Blob;
  loading: JSX.Element;
}

const Pdf = (props: PdfProps) => {
  const { pdf, loading } = props;
  const [numPages, setNumPages] = useState(0);

  return (
    <Document
      file={pdf}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      onLoadError={console.error}
      loading={loading}
    >
      {Array.apply(null, Array(numPages))
        .map((_, i) => i + 1)
        .map((page) => (
          <div key={page}>
            <StyledPage pageNumber={page} scale={1.4} />
            {page !== numPages && <StyledSidedeler />}
          </div>
        ))}
    </Document>
  );
};

const StyledPage = styled(Page)`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const StyledSidedeler = styled.div`
  height: 20px;
  background-color: #e8e9e9;
`;

export default Pdf;
