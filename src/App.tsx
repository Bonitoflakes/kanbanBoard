import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { store } from "@/store/store";
import { APP_ROUTES } from "@/constants/routes";
import Kanban from "@/features/kanban";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to={APP_ROUTES.BOARD} replace />} />
          <Route path={APP_ROUTES.BOARD} element={<Kanban />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
    </Provider>
  );
}

export default App;
