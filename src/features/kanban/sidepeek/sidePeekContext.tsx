import { useToggle } from "@/utils/useToggle";
import { ReactNode, createContext, useContext, useState } from "react";

type SidePeek = {
  isSidepeekOpen: boolean;
  toggleIsSidepeekOpen: (value?: boolean | undefined) => void;

  sidePeekData: {
    id: number;
  };
  setSidePeekData: React.Dispatch<
    React.SetStateAction<{
      id: number;
    }>
  >;
};

const Sidepeek = createContext<SidePeek | null>(null);

const SidePeekProvider = ({ children }: { children: ReactNode }) => {
  const [isSidepeekOpen, toggleIsSidepeekOpen] = useToggle(false);
  const [sidePeekData, setSidePeekData] = useState({
    id: 0,
  });

  return (
    <Sidepeek.Provider
      value={{
        isSidepeekOpen,
        toggleIsSidepeekOpen,
        sidePeekData,
        setSidePeekData,
      }}
    >
      {children}
    </Sidepeek.Provider>
  );
};

const useSidepeek = () => {
  const sidePeekData = useContext(Sidepeek);

  if (!sidePeekData) {
    throw new Error("useSidepeek must be used within SidePeekProvider");
  }

  return sidePeekData;
};

// eslint-disable-next-line react-refresh/only-export-components
export { SidePeekProvider, useSidepeek };
