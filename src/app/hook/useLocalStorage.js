"use client";
import { useEffect, useState } from "react";

export const useLocalStorage = (key) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // Get initial value
    const storedValue = localStorage.getItem(key);
    if (storedValue && storedValue !== "null") {
      setValue(JSON.parse(storedValue));
    }

    // Listen for changes from other tabs/components
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setValue(JSON.parse(e.newValue));
      }
    };

    // Listen for custom event from same tab
    const handleCustomChange = (e) => {
      if (e.detail.key === key) {
        setValue(e.detail.value);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChanged", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChanged", handleCustomChange);
    };
  }, [key]);

  return value;
};