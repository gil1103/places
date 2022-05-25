import React from 'react';

import {Modal} from './Modal';
import Button from '../FormElements/Button';

export const ErrorModal = (props) => {
	return (
		<Modal
			onCancel={props.onClear}
			header="An Error Occurred!"
			show={!!props.error} // casting a variable to be a boolean
			footer={<Button onClick={props.onClear}>Okay</Button>}
		>
			<p>{props.error}</p>
		</Modal>
	);
};

