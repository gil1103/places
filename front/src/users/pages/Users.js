import React, { useEffect, useState } from 'react';
import { UsersList } from '../components/UsersList';
import { ErrorModal } from './../../shared/components/UIElements/ErrorModal';
import { LoadingSpinner } from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/components/hooks/http-hook';

export const Users = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedUsers, setLoadedUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL+'/users'
				);
				// the default method is GET and no need to specify headers as we are
				// not sending anything

				setLoadedUsers(responseData.users);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUsers();
	}, [sendRequest]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedUsers && <UsersList users={loadedUsers} />}
		</React.Fragment>
	);
};

// const USERS = [
// 	{
// 		id: 'u1',
// 		name: 'Gil H',
// 		image:
// 			'https://cdn.shopify.com/s/files/1/0021/5701/9254/products/BBIAA35_FX-ADV_-FORCE-CX1-AQUA-rgb72dpi_d7c23c68-b57e-499c-8641-77fc6848981b.jpg?v=1597187785',
// 		places: 3
// 	}
// ];
