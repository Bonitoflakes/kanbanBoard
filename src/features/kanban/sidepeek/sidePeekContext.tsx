import { useToggle } from "@/utils/useToggle";
import { ReactNode, createContext, useContext, useState } from "react";

type SidePeek = {
  sidebar: boolean;
  toggleSidebar: (value?: boolean) => void;
  sidePeekData: {
    id: number;
  };
  setSidebarData: (id: number) => void;
};

const SidePeek = createContext<SidePeek | null>(null);

const SidePeekProvider = ({ children }: { children: ReactNode }) => {
  const [sidebar, toggleSidebar] = useToggle(false);
  const [sidePeekData, setSidePeekData] = useState({
    id: 0,
  });

  const setSidebarData = (id: number) => {
    setSidePeekData({ id });
  };

  return (
    <SidePeek.Provider
      value={{ sidebar, toggleSidebar, sidePeekData, setSidebarData }}
    >
      {children}
    </SidePeek.Provider>
  );
};

const useSidebar = () => {
  const sidePeekData = useContext(SidePeek);

  if (!sidePeekData) {
    throw new Error("useSidebar must be used within SidePeekProvider");
  }

  return sidePeekData;
};

export { SidePeekProvider, useSidebar };
