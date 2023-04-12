import { ProSidebarProvider } from 'react-pro-sidebar';
import './App.css';
import { Outlet } from "react-router-dom";
import NavSidebar from './components/NavSidebar';

export const BASE_API_URL = 'http://127.0.0.1:8000/api'

function App() {
  return (
    <ProSidebarProvider>
      <div className="App">
        <div className='sidebar-page-section w-1/5'>
          <NavSidebar />
        </div>
        <div className='page  w-4/5'>
          <div className='page-inner'>
            <Outlet />
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
}

export default App;
