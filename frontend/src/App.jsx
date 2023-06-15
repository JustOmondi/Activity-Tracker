import { Bars3Icon, HomeIcon, WrenchIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { useProSidebar } from 'react-pro-sidebar';
import { Outlet } from "react-router-dom";
import './App.css';
import NavSidebar from './components/NavSidebar';
import useAuth from './hooks/useAuth';

function App() {
  const { toggleSidebar } = useProSidebar();

  const { tokenFound } = useAuth()

  useEffect(() => {
    if (!tokenFound) {
      window.location.replace('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      {tokenFound && (
        <>
          <div className='sidebar-page-section'>
            <NavSidebar className=' h-full' toggleSidebar={toggleSidebar} />
          </div>
          <div className='page h-full pt-8 px-6'>
            <div className='lg:hidden mb-4 w-full flex justify-between'>
              <Bars3Icon onClick={() => { toggleSidebar() }} fill='#fff' className='h-8 w-8 text-black' />
              <HomeIcon onClick={() => { toggleSidebar() }} fill='#fff' className='h-8 w-8 text-black' />
              <WrenchIcon onClick={() => { toggleSidebar() }} fill='#fff' className='h-8 w-8 text-black' />
            </div>
            <div className='page-inner overflow-auto w-full'>
              <Outlet />
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default App;
