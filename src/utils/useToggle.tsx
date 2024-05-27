import { useCallback, useState } from "react";

type returnType = [boolean, (value?: boolean) => void];

export const useToggle = (defaultState = false): returnType => {
  const [toggle, setToggle] = useState<boolean>(defaultState);

  const toggleHandler = useCallback((value?: boolean) => {
    if (value !== undefined) return setToggle(value);
    setToggle((prev) => !prev);
  }, []);

  return [toggle, toggleHandler];
};
