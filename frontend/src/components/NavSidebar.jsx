import { ArrowLeftOnRectangleIcon, HomeIcon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Link } from "react-router-dom";

export default function NavSidebar({ toggleSidebar }) {
    const sideBarBGColour = '#111827';

    const [activeLink, setActiveLink] = useState(window.location.pathname)

    const handleLinkClick = ({ target }) => {
        if (window.innerWidth < 900) {
            toggleSidebar()
        }

        setActiveLink(`/${target.innerHTML.toLowerCase()}`)
    }

    const iconClasses = 'h-6 w-6 text-white'

    return (
        <Sidebar backgroundColor={sideBarBGColour} customBreakPoint="1024px" rootStyles={{
            backgroundColor: '#fff',
            padding: '30px 0px 20px 20px',
            height: '100%',
            width: '250px',
            borderRight: `0px solid ${sideBarBGColour}`,
        }}>
            <Menu>
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/dashboard' ? 'active' : ''}`} icon={<HomeIcon className={iconClasses} />} component={<Link to='/dashboard' />}>Dashboard</MenuItem>
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/subgroups' ? 'active' : ''}`} icon={<ListBulletIcon className={iconClasses} />} component={<Link to='/subgroups' />}>Subgroups</MenuItem>
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/members' ? 'active' : ''}`} icon={<UsersIcon className={iconClasses} />} component={<Link to='/members' />}>Members</MenuItem>
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/'}`} icon={<ArrowLeftOnRectangleIcon className={iconClasses} />} component={<Link to='/' />}>Logout</MenuItem>
            </Menu>
        </Sidebar>
    )
}
