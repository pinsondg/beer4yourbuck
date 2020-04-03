import React, {useCallback, useContext, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import './menu-upload.css'
import {Button} from "reactstrap";
import BreweryDBAPI from "../../controller/api/BreweryDBAPI";
import classNames from "classnames";
import {isMobile} from "../../controller/Utils";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {FaCamera} from "react-icons/fa"
import {Beer, BeerInterface} from "../../model/Beer";
import {CompareBeerContext} from "../../context/CompareBeerContext";
import {useHistory} from "react-router-dom";

interface Props {

}

interface UploadError {
    message: string;
    status?: number;
}

const api = new BreweryDBAPI();

let uploadChecker: NodeJS.Timeout | undefined;

export function MenuUpload(props: Props) {
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<UploadError | null>(null);
    const {setCompareBeers} = useContext(CompareBeerContext);
    const [jobId, setJobId] = useState<number | null>(null);
    const history = useHistory();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        setSelectedImageFile(file);
        reader.onload = (e) => {
            if (e && e.target && !(e.target.result instanceof ArrayBuffer)) {
                setImageData(e.target.result);
            }
        };
        reader.readAsDataURL(file);
        setUploadError(null);
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const clearImage = () => {
        setImageData(null);
        setSelectedImageFile(null);
        setIsUploading(false);
    };

    useEffect(() => {
        const checkJob = () => {
            if (jobId) {
                api.checkJobStatus(jobId)
                    .then(data => {
                        const status: string = data.data.status;
                        console.log(data);
                        if (status === 'COMPLETE') {
                            const beers: Beer[] = data.data.beers.map((x: BeerInterface) => new Beer.Builder().withBeer(x).build());
                            setCompareBeers(beers);
                            setIsUploading(false);
                            setUploadError(null);
                            setJobId(null);
                            history.push('/compare');
                        } else if (status === 'FAILED') {
                            setUploadError({message: data.data.message, status: data.status});
                            setIsUploading(false);
                        }
                    }).catch(error => {
                    try {
                        const response = error.response;
                        setUploadError({message: response.data.message, status: response.status});
                    } catch (e) {
                        setUploadError({message: 'We encountered an unknown error! Please try again later.'});
                    } finally {
                        clearImage();
                    }
                });
            }
        };
        if (isUploading) {
            uploadChecker = setInterval(checkJob, 2000);
        } else if (uploadChecker && !isUploading) {
            clearInterval(uploadChecker);
        }
    }, [isUploading, history, jobId, setCompareBeers]);

    const upload = () => {
        if (selectedImageFile) {
            setIsUploading(true);
            api.uploadImage(selectedImageFile).then(data => {
                setJobId(data.data.jobId);
            }).catch(error => {
                try {
                    const response = error.response;
                    setUploadError({message: response.data.message, status: response.status});
                } catch (e) {
                    setUploadError({message: 'We encountered an unknown error! Please try again later.'})
                } finally {
                    clearImage();
                }
            });
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
            <div className={'page-header'}>
                <h1>Menu Upload (BETA)</h1>
            </div>
            <div {...getRootProps()} className={uploadAreaClasses}>
                <input {...getInputProps()} type={'file'} accept="image/*;capture=camera"/>
                {
                    !isMobile() ?
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag image files here or click to upload</p>
                        : <p>Tap to take picture<br/><FaCamera/></p>
                }
            </div>
            {
                uploadError &&
                <div className={'upload-error'}>
                    <p>There was an error uploading your file: {uploadError.message}</p>
                </div>
            }
            <div className={imageHolderClasses}>
                <div className={'selected-image-header'}>
                    <h3>Selected Image</h3>
                </div>
                {
                    imageData ? (
                        <div className={'image-wrapper'}>
                            <img className={'image'} src={imageData ? imageData : ''} alt={'Error rendering.'}/>
                        </div>
                    ) : (
                        <p>No file selected.</p>
                    )
                }
                {
                    isUploading ? (
                        <div className={'processing-holder'}>
                            <p>Processing upload...</p>
                            <AiOutlineLoading3Quarters size={42} className={'loading-icon'}/>
                        </div>
                    ) : (
                        <div className={'button-holder'}>
                            <Button className={'control-btn'} disabled={imageData === null || isUploading} onClick={upload}>Upload</Button>
                            <Button className={'control-btn'} disabled={isUploading} onClick={clearFile}>Back</Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}