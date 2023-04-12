import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {Link} from "react-router-dom";
import { ArrowLeftOnRectangleIcon, ChartBarIcon, HomeIcon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function NavSidebar() {
    const { collapseSidebar } = useProSidebar();

    const sideBarBGColour = '#111827';

    return (
        <div className='flex h-full pl-7 pb-7 pt-7'> 
            <div className='sidebar-container p-4 pt-14 flex w-full h-full rounded-3xl bg-gray-900'>
                <Sidebar backgroundColor={sideBarBGColour} rootStyles={{
                    backgroundColor: '#111827',
                    borderRight: `0px solid ${sideBarBGColour}`,
                    width: '100%'
                }}>
                    <Menu>
                        <MenuItem icon={<HomeIcon className='h-6 w-6 text-white'/>} component={<Link to="/home" />}> Home </MenuItem>
                        <MenuItem icon={<ListBulletIcon className='h-6 w-6 text-white'/>} component={<Link to="/subgroups" />}> Subgroups </MenuItem>
                        <MenuItem icon={<UsersIcon className='h-6 w-6 text-white'/>} component={<Link to="/members" />}> Members </MenuItem>
                    </Menu>
                    <div className='sidebar-footer'>
                        <Menu>
                            <MenuItem icon={<ArrowLeftOnRectangleIcon className='h-6 w-6 text-white'/>} component={<Link to="/" />}> Logout </MenuItem>
                        </Menu>
                    </div>
                    
                </Sidebar>
            </div>
        </div>
    )
}
