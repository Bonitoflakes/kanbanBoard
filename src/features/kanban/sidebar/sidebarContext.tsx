import { useToggle } from "@/utils/useToggle";
import { ReactNode, createContext, useContext } from "react";

type SidebarContext = {
  sidebar: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContext | null>(null);

const SidebarContextProvider = ({ children }: { children: ReactNode }) => {
  const [sidebar, toggleSidebar] = useToggle(true);

  return (
    <SidebarContext.Provider value={{ sidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const data = useContext(SidebarContext);

  if (!data) {
    throw new Error("useSidebar must be used within SidebarContextProvider");
  }

  return data;
};

export { SidebarContextProvider, useSidebar };
