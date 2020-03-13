import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import './menu-upload.css'

interface Props {

}
export function MenuUpload(props: Props) {

    const onDrop = useCallback((acceptedFiles: File[]) => {

    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

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
        </div>
    );
}