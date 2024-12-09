import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import "./App.css";
import authProvider from "./authProvider";
import { Login } from "./pages/login";
import { Layout } from "./components/layout";
import { PatientCreate, PatientEdit, PatientList, PatientShow } from "./pages/patient";
import Statistics from "./pages/statistics/list";
import UserList from "./pages/user/list";
import { ModalsProvider } from "@mantine/modals";
import {
  IconChartBar,
  IconUser,
  IconUserScan,
  IconUsers,
  IconUsersPlus,
} from "@tabler/icons-react";
import api from "./axios";

const theme = createTheme({
  /** Put your mantine theme override here */
});
function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <RefineKbarProvider>
            <Refine
              dataProvider={dataProvider(
                "https://back.universal-hub.site",
                api
              )}
              routerProvider={routerBindings}
              authProvider={authProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "un07Zg-c7lhAG-jz1cfi",
              }}
              resources={[
                {
                  name: "patient",
                  list: "/patient",
                  create: "/patient/create",
                  edit: "/patient/edit/:id",
                  show: "/patient/:id",
                  meta: {
                    icon: <IconUsersPlus />,
                    label: "Пациенты",
                  },
                },
                {
                  name: "statistics",
                  list: "/statistics",
                  meta: {
                    icon: <IconChartBar />,
                    label: "Статистика",
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  meta: {
                    icon: <IconUsers />,
                    label: "Пользователи",
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="patient" />}
                  />
                  <Route path="/patient">
                    <Route index element={<PatientList />} />
                    <Route path=":id" element={<PatientShow />} />
                    <Route path="create" element={<PatientCreate />} />
                    <Route path="edit/:id" element={<PatientEdit />} />
                  </Route>
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/users" element={<UserList />} />
                </Route>
                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="patient" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineKbarProvider>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
