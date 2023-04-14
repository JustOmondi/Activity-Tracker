import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {Link} from "react-router-dom";
import { ArrowLeftOnRectangleIcon, HomeIcon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function NavSidebar({collapse}) {
    const sideBarBGColour = '#111827';

    return (
        <Sidebar backgroundColor={sideBarBGColour} customBreakPoint="1024px" rootStyles={{
            backgroundColor: '#fff',
            padding: '30px 0px 20px 20px',
            height: '100%',
            width: '250px',
            borderRight: `0px solid ${sideBarBGColour}`,
        }}>
           <Menu>
                <MenuItem icon={<HomeIcon className='h-6 w-6 text-white'/>} component={<Link to="/home" />}> Home </MenuItem>
                <MenuItem icon={<ListBulletIcon className='h-6 w-6 text-white'/>} component={<Link to="/subgroups" />}> Subgroups </MenuItem>
                <MenuItem icon={<UsersIcon className='h-6 w-6 text-white'/>} component={<Link to="/members" />}> Members </MenuItem>
                <MenuItem className='absolute bottom-0' icon={<ArrowLeftOnRectangleIcon className='h-6 w-6 text-white'/>} component={<Link to="/" />}> Logout </MenuItem>
            </Menu>
            
        </Sidebar>
    )
}
