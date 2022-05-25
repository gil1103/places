import React, { useState, useCallback, Suspense } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate
} from 'react-router-dom';
import { Users } from './users/pages/Users';
import { NewPlace } from './places/pages/NewPlace';
import { UserPlaces } from './places/pages/UserPlaces';
import { UpdatePlace } from './places/pages/UpdatePlace';
import { Auth } from './users/pages/Auth';
import { MainNavigation } from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/components/context/auth-contex';
import { LoadingSpinner } from './shared/components/UIElements/LoadingSpinner';

// const Users = React.lazy(() => import('./users/pages/Users'));
// const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
// const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
// const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
// const Auth = React.lazy(() => import('./users/pages/Auth'));

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);

	const login = useCallback((uid) => {
		setIsLoggedIn(true);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;

	if (isLoggedIn) {
		routes = (
			<React.Fragment>
				<Route path="/" element={<Users />} />
				<Route path="/:userId/places" element={<UserPlaces />} />
				<Route path="/places/new" element={<NewPlace />} />
				<Route path="/places/:placeId" element={<UpdatePlace />} />
				<Route path="*" element={<Navigate to="/" />} />
			</React.Fragment>
		);
	} else {
		routes = (
			<React.Fragment>
				<Route path="/" element={<Users />} />
				<Route path="/:userId/places" element={<UserPlaces />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="*" element={<Navigate to="/auth" />} />
			</React.Fragment>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: isLoggedIn,
				userId: userId,
				login: login,
				logout: logout
			}}
		>
			<Router>
				<MainNavigation />
				<main>
					<Suspense
						fallback={
							<div className="center">
								<LoadingSpinner />
							</div>
						}
					>
						<Routes>{routes}</Routes>
					</Suspense>
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
