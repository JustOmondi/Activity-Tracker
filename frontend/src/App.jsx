import { useProSidebar } from 'react-pro-sidebar';
import './App.css';
import { Outlet } from "react-router-dom";
import NavSidebar from './components/NavSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Button} from 'antd';

function App() {
  const { collapseSidebar, toggleSidebar } = useProSidebar();

  return (
      <div className="App">
        <div className='sidebar-page-section'>
          <NavSidebar className=' h-full' />
        </div>
        <div className='page h-full'>
          <div className='lg:hidden m-2 w-full'>
            <Button className='pt-0 items-center' onClick={() => {toggleSidebar()}} icon={<Bars3Icon fill='#fff' className='h-7 w-7 text-black'/>}  />
            
          </div>
          <div className='page-inner overflow-auto w-full'>
            <Outlet />
          </div>
        </div>
      </div>
  );
}

export default App;
