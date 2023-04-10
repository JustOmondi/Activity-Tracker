import { ProSidebarProvider } from 'react-pro-sidebar';
import './App.css';
import Header from './components/Header';
import { Outlet } from "react-router-dom";
import NavSidebar from './components/NavSidebar';

export const BASE_API_URL = 'http://127.0.0.1:8000/api'

function App() {
  return (
    <ProSidebarProvider>
      <div className="App">
        <Header />
        <NavSidebar />
        My App
        <div className='page'>
          <Outlet />
        </div>
      </div>
    </ProSidebarProvider>
  );
}

export default App;
