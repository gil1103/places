import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

export const UserItem = ({ userId, name, image, placesCount }) => {
	return (
		<li className="user-item">
			<Card>
				<Link to={`/${userId}/places`}>
					<div className="user-item__image">
						<Avatar
							image={`${process.env.REACT_APP_ASSET_URL}/${image}`}
							alt={name}
						/>
					</div>
					<div className="user-item__info">
						<h2>{name}</h2>
						<h3>
							{placesCount} {placesCount === 1 ? 'Place' : 'Places'}
						</h3>
					</div>
				</Link>
			</Card>
		</li>
	);
};
