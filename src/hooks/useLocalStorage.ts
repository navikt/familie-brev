import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      console.log("GETTING ITEM");
      const item = window.localStorage.getItem(key);
      console.log(window.localStorage);
      console.log("item", item);

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
