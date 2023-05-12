import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import FortnightOverviewPage from './pages/FortnightOverviewPage';
import MembersPage from './pages/MembersPage';
import SubgroupsPage from './pages/SubgroupsPage';

import { ProSidebarProvider } from 'react-pro-sidebar';

import { Provider } from 'react-redux';
import store from './app/store';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard/",
        element: <Dashboard />,
      },
      {
        path: "members/",
        element: <MembersPage />,
      },
      {
        path: "subgroups/",
        element: <SubgroupsPage />,
      },
      {
        path: "reports/",
        element: <FortnightOverviewPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ProSidebarProvider>
        <RouterProvider router={router} />
      </ProSidebarProvider>
    </Provider>
  </React.StrictMode>
);

