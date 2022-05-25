import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainHeader } from './MainHeader';
import { NavLinks } from './NavLinks';
import { SideDrawer } from './SideDrawer';
import Backdrop from './../UIElements/Backdrop';
import './MainNavigation.css';

export const MainNavigation = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		<React.Fragment>
			{isDrawerOpen && <Backdrop onClick={closeDrawer} />}
			{isDrawerOpen && (
				<SideDrawer show={isDrawerOpen} onClick={closeDrawer}>
					<nav className="main-navigation__drawer-nav">
						<NavLinks />
					</nav>
				</SideDrawer>
			)}
			<MainHeader>
				<button
					className="main-navigation__menu-btn"
					onClick={() => setIsDrawerOpen(true)}
				>
					<span />
					<span />
					<span />
				</button>
				<h1 className="main-navigation__title">
					<Link to="/">YourPlaces</Link>
				</h1>
				<nav className="main-navigation__header-nav">
					<NavLinks />
				</nav>
			</MainHeader>
		</React.Fragment>
	);
};
