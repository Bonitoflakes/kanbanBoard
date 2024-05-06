import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "@/store/store";
import Kanban from "./features/kanban";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Kanban />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
