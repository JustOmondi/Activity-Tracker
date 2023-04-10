import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {Link} from "react-router-dom";

export default function NavSidebar() {
    const { collapseSidebar } = useProSidebar();

    return (
        <div className='flex h-full'>
            <Sidebar>
                <Menu>
                    <MenuItem component={<Link to="/" />}> Home </MenuItem>
                    <MenuItem component={<Link to="/subgroups" />}> Subgroups </MenuItem>
                    <MenuItem component={<Link to="/members" />}> Members </MenuItem>
                    <MenuItem component={<Link to="/logout" />}> Logout </MenuItem>
                </Menu>
            </Sidebar>
        </div>
    )
}
