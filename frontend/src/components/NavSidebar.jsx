import { ArrowLeftOnRectangleIcon, HomeIcon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { REFRESH_TOKEN } from '../Config';
import { setLoggedIn } from '../app/mainSlice';
import { deleteCookie } from '../utils';

export default function NavSidebar({ toggleSidebar }) {
    const sideBarBGColour = '#111827';

    const [activeLink, setActiveLink] = useState(window.location.pathname)

    const dispatch = useDispatch()

    const handleLinkClick = ({ target }) => {
        if (window.innerWidth < 900) {
            toggleSidebar()
        }

        setActiveLink(`/app/${target.innerHTML.toLowerCase()}`)
    }

    const handleLogoutClick = () => {
        deleteCookie(REFRESH_TOKEN)

        dispatch(setLoggedIn(false))

        window.location.replace('/')
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
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/app/dashboard' ? 'active' : ''}`} icon={<HomeIcon className={iconClasses} />} component={<Link to='/app/dashboard' />}>Dashboard</MenuItem>
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/app/subgroups' ? 'active' : ''}`} icon={<ListBulletIcon className={iconClasses} />} component={<Link to='/app/subgroups' />}>Subgroups</MenuItem>
                <MenuItem onClick={handleLinkClick} className={`${activeLink === '/app/members' ? 'active' : ''}`} icon={<UsersIcon className={iconClasses} />} component={<Link to='/app/members' />}>Members</MenuItem>
                <MenuItem onClick={handleLogoutClick} icon={<ArrowLeftOnRectangleIcon className={iconClasses} component={<Link to='/' />} />}>Logout</MenuItem>
            </Menu>
        </Sidebar>
    )
}
