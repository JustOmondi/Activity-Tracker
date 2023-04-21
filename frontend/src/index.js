import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SubgroupsListPage from './pages/SubgroupsListPage';
import MembersListPage from './pages/MembersListPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
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
        path: "home/",
        element: <HomePage />,
      },
      {
        path: "members/",
        element: <MembersListPage />,
      },
      {
        path: "member/:memberId",
        element: <MembersListPage />,
      },
      {
        path: "subgroups/",
        element: <SubgroupsListPage />,
      },
      {
        path: "department/:departmentId",
        element: <MembersListPage />,
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
