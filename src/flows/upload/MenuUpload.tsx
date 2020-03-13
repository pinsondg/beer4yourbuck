import React, {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import './menu-upload.css'
import {Button} from "reactstrap";
import BreweryDBAPI from "../../controller/api/BreweryDBAPI";

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
        if (selectedImageFile) {
            reader.readAsDataURL(selectedImageFile);
        }
    }, [selectedImageFile]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const upload = () => {
        if (selectedImageFile) {
            api.uploadImage(selectedImageFile);
        }
    };

    return (
        <div className={'page'}>
            <h1>Upload</h1>
            <div {...getRootProps()} className={'upload-area'}>
                <input {...getInputProps()} type={'file'} accept="image/*;capture=camera"/>
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag image files here or click to upload/capture</p>
                }
            </div>
            <div className={'selected-image-holder'}>
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
            </div>
        </div>
    );
}