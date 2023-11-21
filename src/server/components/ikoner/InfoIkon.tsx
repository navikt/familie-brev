import * as React from 'react';

interface Props {
  className?: string;
  heigth?: number;
  width?: number;
}
const InfoIkon: React.FC<Props> = ({ className, heigth, width }) => {
  return (
    <svg
      aria-labelledby={'ikke vurdert'}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      height={heigth}
      width={width}
    >
      <title id={'ikke vurdert'}>Ikke vurdert</title>
      <path
        d="M12 0C5.382 0 0 5.382 0 12s5.382 12 12 12c6.617 0 12-5.382 12-12S18.617 0 12 0z"
        fill="#337C9B"
      />
      <path
        d="M12 5a1.566 1.566 0 1 1 .11 3.13A1.566 1.566 0 0 1 12 5zm2.976 12.01c.563 0 1.043.431 1.043.991s-.48.992-1.043.992H9.39c-.564 0-1.043-.431-1.043-.992 0-.56.479-.99 1.043-.99h1.6v-5.016h-.986c-.565 0-1.044-.43-1.044-.991 0-.56.48-.991 1.044-.991h2.03c.563 0 1.043.43 1.043.99v6.007h1.899z"
        fill="#FFF"
      />
    </svg>
  );
};

export default InfoIkon;
