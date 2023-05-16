import { Button } from 'antd';
import React from 'react';
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className='page h-full pt-8 px-6'>
      <div className='page-inner overflow-auto w-full flex flex-col items-center justify-center'>
        <h1 className='text-gray-400 -mb-8 text-[8em] md:text-[10em] xl:text-[15em]'>404</h1>
        <h3 className='text-[2em] md:text-[4em] xl:text-[5em]'>Page not found</h3>
        <Link to='/app/dashboard'>
          <Button
            className='bg-black text-white shadow-md flex items-center mt-6'
            type='primary'
            size='large'>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
