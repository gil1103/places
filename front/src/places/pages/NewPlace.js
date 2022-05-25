import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../shared/components/utill/validators';
import { VALIDATOR_MINLENGTH } from '../../shared/components/utill/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/components/hooks/form-hook';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import { AuthContext } from '../../shared/components/context/auth-contex';
import { ErrorModal } from '../../shared/components/UIElements/ErrorModal';
import { ImageUpload } from './../../shared/components/FormElements/ImageUpload';
import { LoadingSpinner } from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceForm.css';

export const NewPlace = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false
			},
			description: {
				value: '',
				isValid: false
			},
			address: {
				value: '',
				isValid: false
			},
			image: {
				value: '',
				isValid: false
			}
		},
		false
	);

	let navigate = useNavigate();

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		console.log(formState.inputs); // send to the backend
		try {
			const formData = new FormData();
			formData.append('title',formState.inputs.title.value)
			formData.append('description', formState.inputs.description.value);
			formData.append('address', formState.inputs.address.value);
			formData.append('creator', auth.userId);
			formData.append('image',formState.inputs.image.value)
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL+'/places',
				'POST',
				formData
			);
			navigate('/');
		} catch (err) {
			console.log(err); // err is being handled on the http-hook
			// redirect the user to different page
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form className="place-form" onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay={true} />}
				<Input
					id="title"
					element="input"
					type="text"
					label="Title"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid title"
					onInput={inputHandler}
				/>
				<Input
					id="description"
					element="textarea"
					label="Description"
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid description (at least 5 characters)"
					onInput={inputHandler}
				/>
				<Input
					id="address"
					element="input"
					label="Address"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid address"
					onInput={inputHandler}
				/>
				<ImageUpload
					id="image"
					onInput={inputHandler}
					errorText="Please provide an image"
				/>
				<Button type="submit" disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</React.Fragment>
	);
};
