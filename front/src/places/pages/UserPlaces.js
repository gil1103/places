import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlacesList } from './../components/PlacesList';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import { ErrorModal } from './../../shared/components/UIElements/ErrorModal';
import { LoadingSpinner } from './../../shared/components/UIElements/LoadingSpinner';

export const UserPlaces = () => {
	const [loadedPlaces, setLoadedPlaces] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const userId = useParams().userId;

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
				);
				// the default method is GET and no need to specify headers as we are
				// not sending anything
				setLoadedPlaces(responseData.places);
				console.log('responseData', responseData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchPlaces();
	}, [sendRequest, userId]);

	const placeDeleteHandler = (placeId) => {
		setLoadedPlaces((prevPlaces) =>
			prevPlaces.filter((place) => place.id !== placeId)
		);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner asOverlay={true} />
				</div>
			)}
			{!isLoading && loadedPlaces && (
				<PlacesList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
			)}
			;
		</React.Fragment>
	);
};

// const DUMMY_PLACES = [
// 	{
// 		id: 'p1',
// 		title: 'Empire State Building',
// 		description: 'One of the most famous sky scrapers in the world!',
// 		imageUrl:
// 			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
// 		address: '20 W 34th St, New York, NY 10001',
// 		location: {
// 			lat: 40.7484405,
// 			lng: -73.9878584
// 		},
// 		creator: 'u1'
// 	},
// 	{
// 		id: 'p2',
// 		title: 'Empire State Building',
// 		description: 'One of the most famous sky scrapers in the world!',
// 		imageUrl:
// 			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
// 		address: '20 W 34th St, New York, NY 10001',
// 		location: {
// 			lat: 40.7484405,
// 			lng: -73.9878584
// 		},
// 		creator: 'u2'
// 	}
// ];

// const userPlaces = DUMMY_PLACES.filter((place) => {
// 	return place.creator === userId;
// });
