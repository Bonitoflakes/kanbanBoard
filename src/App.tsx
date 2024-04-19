import { Provider } from "react-redux";
import { store } from "@/store/store";
import Kanban from "./kanban";

function App() {
  return (
    <Provider store={store}>
      <Kanban />
    </Provider>
  );
}

export default App;
