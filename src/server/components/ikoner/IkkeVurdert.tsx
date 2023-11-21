import React from 'react';
interface Props {
  className?: string;
  heigth?: number;
  width?: number;
}
export const IkkeVurdert: React.FC<Props> = ({ className, heigth, width }) => {
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
        fill="#FFA733"
        d="M12.205.996l-.214.002a12.226 12.226 0 00-8.517 3.658c-2.295 2.32-3.527 5.355-3.472 8.55.115 6.611 5.296 11.79 11.795 11.79l.212-.002c6.726-.116 12.105-5.593 11.99-12.207-.115-6.61-5.296-11.79-11.794-11.79z"
      ></path>
      <path
        fill="#3E3832"
        fillRule="evenodd"
        d="M13 6.8a1 1 0 10-2 0v7a1 1 0 102 0v-7zm-1 13h.027a1.5 1.5 0 00-.027-3l-.013.002h-.014A1.498 1.498 0 0012 19.801z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
