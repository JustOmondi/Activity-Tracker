import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {Link} from "react-router-dom";

export default function NavSidebar() {
    const { collapseSidebar } = useProSidebar();

    const sideBarBGColour = '#111827';

    return (
        <div className='flex h-full pl-7 pb-7 pt-7'> 
            <div className='sidebar-container p-4 pt-14 flex h-full rounded-3xl bg-gray-900'>
                <Sidebar backgroundColor={sideBarBGColour} rootStyles={{
                    backgroundColor: '#111827',
                    borderRight: `0px solid ${sideBarBGColour}`,
                }}>
                    <Menu>
                        <MenuItem component={<Link to="/" />}> Home </MenuItem>
                        <MenuItem component={<Link to="/subgroups" />}> Subgroups </MenuItem>
                        <MenuItem component={<Link to="/members" />}> Members </MenuItem>
                    </Menu>
                    <div className='sidebar-footer'>
                        <Menu>
                            <MenuItem component={<Link to="/" />}> Logout </MenuItem>
                        </Menu>
                    </div>
                    
                </Sidebar>
            </div>
        </div>
    )
}
