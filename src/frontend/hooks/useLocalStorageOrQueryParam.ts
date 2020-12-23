import { useCallback, useState } from 'react';
import qs from 'query-string';

export const useLocalStorageOrQueryParam = (key: string, initialValue: any, location?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const params: any = location && qs.parse(location.search.replace(/([/])(?==)/, ''));

      if (params?.brevtype) {
        return params.brevtype.replace('+', ' ');
      }

      const item = window.localStorage.getItem(key);

      if (item === null || item === 'undefined') return initialValue;
      else return JSON.parse(item);
    } catch (error) {
      console.log('Error', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: any) => {
      try {
        setStoredValue(value);

        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
};
