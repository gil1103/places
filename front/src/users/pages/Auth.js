import React, { useState, useContext } from 'react';
import Card from './../../shared/components/UIElements/Card';
import { Input } from './../../shared/components/FormElements/Input';
import Button from './../../shared/components/FormElements/Button';
import { ErrorModal } from '../../shared/components/UIElements/ErrorModal';
import { LoadingSpinner } from './../../shared/components/UIElements/LoadingSpinner';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE
} from './../../shared/components/utill/validators';
import { useForm } from '../../shared/components/hooks/form-hook';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import { AuthContext } from '../../shared/components/context/auth-contex';
import { ImageUpload } from './../../shared/components/FormElements/ImageUpload';
import './Auth.css';

export const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false
			},
			password: {
				value: '',
				isValid: false
			}
		},
		false // initialFormValidity
	);

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined, // we want to drop the name field
					image: undefined
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false
					},
					image: {
						value: null,
						isValid: false
					}
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = async (ev) => {
		ev.preventDefault();

		console.log(formState.inputs);

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL+'/users/login',
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value
					}),
					{
						'Content-Type': 'application/json'
					}
				);
				auth.login(responseData.user.id);
			} catch (err) {
				console.log(err); // err is being handled on the http-hook
			}
		} else {
			try {
				const formData = new FormData();
				formData.append('email',formState.inputs.email.value)
				formData.append('name', formState.inputs.name.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', formState.inputs.image.value);
				const responseData = await sendRequest(
					process.env.REACT_APP_ASSET_URL + '/api/users/signup',
					'POST',
					formData // formdata define which headers will be used
				);
				auth.login(responseData.user.id);
			} catch (err) {
				console.log(err); // err is being handled on the http-hook
			}
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay={true} />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a name"
							onInput={inputHandler}
						/>
					)}
					{!isLoginMode && (
						<ImageUpload
							center
							id="image"
							onInput={inputHandler}
							errorText="Please provide an image"
						/>
					)}
					<Input
						element="input"
						id="email"
						type="email"
						label="E-Mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address"
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password, at least 6 characters"
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};
