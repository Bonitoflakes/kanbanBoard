import { Provider } from "react-redux";
import { store } from "@/store/store";
import Kanban from "./features/kanban";
import { SidePeekProvider } from "./features/kanban/sidepeek/sidePeekContext";

function App() {
  return (
    <Provider store={store}>
      <SidePeekProvider>
        <Kanban />
      </SidePeekProvider>
    </Provider>
  );
}

export default App;
