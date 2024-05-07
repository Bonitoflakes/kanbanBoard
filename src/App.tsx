import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { store } from "@/store/store";
import { APP_ROUTES } from "@/constants/routes";
import Kanban from "@/features/kanban";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to={APP_ROUTES.BOARD} replace />} />
          <Route path={APP_ROUTES.BOARD} element={<Kanban />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
