import { useProSidebar } from 'react-pro-sidebar';
import './App.css';
import { Outlet } from "react-router-dom";
import NavSidebar from './components/NavSidebar';
import { Bars3Icon, HomeIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { Button} from 'antd';

function App() {
  const { collapseSidebar, toggleSidebar } = useProSidebar();

  return (
      <div className="App">
        <div className='sidebar-page-section'>
          <NavSidebar className=' h-full' />
        </div>
        <div className='page h-full pt-8 px-6'>
          <div className='lg:hidden mb-4 w-full flex justify-between'>
            <Bars3Icon onClick={() => {toggleSidebar()}} fill='#fff' className='h-8 w-8 text-black'/>
            <HomeIcon onClick={() => {toggleSidebar()}} fill='#fff' className='h-8 w-8 text-black'/>
            <WrenchIcon onClick={() => {toggleSidebar()}} fill='#fff' className='h-8 w-8 text-black'/>
            
          </div>
          <div className='page-inner overflow-auto w-full'>
            <Outlet />
          </div>
        </div>
      </div>
  );
}

export default App;
