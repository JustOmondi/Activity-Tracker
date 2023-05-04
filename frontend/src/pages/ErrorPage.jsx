import React from 'react'
import { Button } from 'antd';
import {Link} from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className='page h-full pt-8 px-6'>
       <div className='page-inner overflow-auto w-full flex flex-col items-center justify-center'>
          <h1 style={{fontSize: '15rem'}} className='text-gray-400 -mb-8'>404</h1>
          <h3 style={{fontSize: '3rem'}}>Page not found</h3>
          <Link to='/dashboard'>
            <Button 
                className='bg-black text-white shadow-md flex items-center mt-6' 
                type='primary'
                size='large'>
                Got to Dashboard
            </Button>
          </Link>
        </div>
    </div>
  )
}
