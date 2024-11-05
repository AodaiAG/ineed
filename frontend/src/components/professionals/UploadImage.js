import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { API_URL } from '../../utils/constans';
import axios from 'axios';
import styles from '../../styles/UploadImage.module.css';

function UploadImage({ initialImage, onImageUpload }) {
    const [originalImage, setOriginalImage] = useState(initialImage || "/images/Prof/w.png");
    const [image, setImage] = useState(originalImage);
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isPictureLoading, setIsPictureLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsPictureLoading(true);
            const fileUrl = URL.createObjectURL(file);
            setOriginalImage(fileUrl);  // Set as the base image
            setImage(fileUrl);
            setShowCropper(true);
            setIsPictureLoading(false);
        }
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const getCroppedImage = async () => {
        const imageFile = await createImage(originalImage);  // Use originalImage
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            imageFile,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const croppedUrl = URL.createObjectURL(blob);
                resolve({ blob, url: croppedUrl });
            }, 'image/jpeg');
        });
    };

    const saveCroppedImage = async () => {
        const { blob, url } = await getCroppedImage();
        setImage(url);  // Update the preview image only
        setShowCropper(false);

        if (originalImage === image) {  // Upload only once
            const formData = new FormData();
            formData.append('image', blob);

            try {
                const response = await axios.post(`${API_URL}/professionals/upload-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onImageUpload(response.data.imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.src = url;
            image.onload = () => resolve(image);
            image.onerror = (error) => reject(error);
        });

    return (
        <div className={styles['upload-image-container']}>
            {isPictureLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <img
                        src={image}
                        alt="Uploaded"
                        className={styles['preview-image']}
                        style={{ objectFit: 'cover' }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <div className={styles['button-group']}>
                        <button onClick={handleUploadButtonClick}>
                            {image === "/images/Prof/w.png" ? 'Add Picture' : 'Replace Picture'}
                        </button>
                        {image !== "/images/Prof/w.png" && (
                            <button onClick={() => setShowCropper(true)}>Edit</button>
                        )}
                    </div>
                </>
            )}
            {showCropper && (
                <div className={styles['cropper-popup']}>
                    <div className={styles['cropper-controls']}>
                        <div className={styles['crop-container']}>
                            <Cropper
                                image={originalImage}  // Always use originalImage for cropping
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                        <button className={styles['save-button']} onClick={saveCroppedImage}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadImage;
