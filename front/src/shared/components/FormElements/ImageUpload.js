import React, { useRef, useState, useEffect } from 'react';
import './ImageUpload.css';
import Button from './Button';

export const ImageUpload = (props) => {
	const [imageFile, setImageFile] = useState();
	const [previewUrl, setPreviewUrl] = useState();
	const [isValid, setIsValid] = useState(false);
	const filePickerRef = useRef();

	useEffect(() => {
		if (!imageFile) return;
		const fileReader = new FileReader();
		fileReader.onload = () => {
			// after upload is completed
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(imageFile);
	}, [imageFile]);

	const pickedHandler = (ev) => {
		let isFileValid;
		let pickedFile;
		if (ev.target.files && ev.target.files.length === 1) {
			pickedFile = ev.target.files[0];
			setImageFile(pickedFile);
			setIsValid(true);
			isFileValid = true;
		} else {
			setIsValid(false);
			isFileValid = false;
		}
		props.onInput(props.id, pickedFile, isFileValid);
	};

	const pickImageHandler = () => {
		filePickerRef.current.click();
	};

	return (
		<div className="form-control">
			{/*form-control was taken from the input module as it is a global one */}
			<input
				id={props.id}
				ref={filePickerRef}
				style={{ display: 'none' }}
				type="file"
				accept=".jpg,.png,.jpeg"
				onChange={pickedHandler}
			/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className="image-upload__preview">
					{previewUrl && <img src={previewUrl} alt="Preview" />}
					{!previewUrl && <p>Please pick an image</p>}
				</div>
				<Button type="button" onClick={pickImageHandler}>
					Pick an image
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
};
