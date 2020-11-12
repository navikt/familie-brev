import { useState } from 'react';
const qs = require('query-string');

export const useLocalStorageOrQueryParam = (key: string, initialValue: any, location?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const params = location && qs.parse(location.search.replace(/([/])(?==)/, ""));
    
      if (params?.brevtype) {
        return params.brevtype.replace("+", " ")
      }

      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log("Error", error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
