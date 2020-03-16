import React, {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import './menu-upload.css'
import {Button} from "reactstrap";
import BreweryDBAPI from "../../controller/api/BreweryDBAPI";
import classNames from "classnames";
import {isMobile} from "../../controller/Utils";
import {FaCamera} from "react-icons/all";

interface Props {

}

const api = new BreweryDBAPI();

export function MenuUpload(props: Props) {
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        setSelectedImageFile(file);
        reader.onload = (e) => {
            console.log("Image processed!");
            if (e && e.target && !(e.target.result instanceof ArrayBuffer)) {
                console.log(e.target.result);
                setImageData(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const upload = () => {
        if (selectedImageFile) {
            api.uploadImage(selectedImageFile);
        }
    };

    const uploadAreaClasses = classNames('upload-area', {
        'mobile' : isMobile(),
        'hidden' : selectedImageFile !== null
    });

    const imageHolderClasses = classNames('selected-image-holder', {
        'hidden' : selectedImageFile === null
    });

    const clearFile = () => {
        setSelectedImageFile(null);
        setImageData(null);
    };

    return (
        <div className={'page'}>
            <h1>Upload</h1>
            <div {...getRootProps()} className={uploadAreaClasses}>
                <input {...getInputProps()} type={'file'} accept="image/*;capture=camera"/>
                {
                    !isMobile() ?
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag image files here or click to upload/capture</p>
                        : <p>Tap to take picture<br/><FaCamera/></p>
                }
            </div>
            <div className={imageHolderClasses}>
                <h3>Selected Image</h3>
                {
                    imageData ? (
                        <div style={{width: '100%', height: '90%', display: 'block', margin: '5px'}}>
                            <img className={'image'} src={imageData ? imageData : ''} alt={'Error rendering.'}/>
                        </div>
                    ) : (
                        <p>No file selected.</p>
                    )
                }
                <Button disabled={imageData === null} onClick={upload}>Upload</Button>
                <Button onClick={clearFile}>Back</Button>
            </div>
        </div>
    );
}