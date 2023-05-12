import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './pages/ErrorPage';
import FortnightOverviewPage from './pages/FortnightOverviewPage';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import SubgroupsPage from './pages/SubgroupsPage';

import { ProSidebarProvider } from 'react-pro-sidebar';

import store from './app/store'
import { Provider } from 'react-redux'


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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
