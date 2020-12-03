import { useState, Dispatch, SetStateAction, useCallback } from 'react';

export function useLocalStorage<S>(key: string, initialValue: S): [S, Dispatch<SetStateAction<S>>] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log("Error", error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
