import React, {useContext, useEffect, useReducer, useState} from "react";
import {Col, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import 'rc-time-picker/assets/index.css';
import CustomCheckbox from "../../misc/checkbox/CustomCheckbox";
import './time-choose-modal.css'
import {Beer4YourBuckBtn, BtnType} from "../../button/custom-btns/ThemedButtons";
import {BeerVenue} from "../../../model/BeerVenue";
import {LoadingSpinner} from "../../load/LoadSpinner";
import {NotificationContext, NotificationType} from "../../../context/NotificationContext";
import Beer4YourBuckAPI from "../../../controller/api/Beer4YourBuckAPI";
import {DateTime} from "luxon";


interface Props {
    onClose: () => void;
    show: boolean;
    venue?: BeerVenue;
    onSubmitSuccess?: () => void;
}

const api = Beer4YourBuckAPI.getInstance();

type Action =
    | {type: 'setStartTime', val: string}
    | {type: 'setEndTime', val: string}
    | {type: 'addOrRemoveDay', day: string, add: boolean}
    | {type: 'reset'}

interface FormData {
    daysOfWeek: string[];
    startTime: string;
    endTime: string;
}

interface InputValidations {
    startTimeInvalid: boolean;
    endTimeInvalid: boolean;
    daysOfWeekInvalid: boolean;
}

function getUTCTime(val: string): string {
    let dateTime = DateTime.fromObject({hour: +val.substring(0, val.indexOf(':')), minute: +val.substring(val.indexOf(':') + 1)});
    const isoTime = dateTime.toISOTime();
    if (isoTime !== null) {
        return isoTime.toString();
    } else {
        return val;
    }
}

function reducer(state: FormData, action: Action): FormData {
    let newState: FormData;
    switch (action.type) {
        case 'setStartTime':
            try {
                newState = {...state, startTime: `${getUTCTime(action.val)}`};
            } catch (e) {
                newState = {...state};
            }
            break;
        case "addOrRemoveDay":
            if (action.add) {
                newState = {...state, daysOfWeek: [...state.daysOfWeek, action.day]};
            } else {
                newState =  {...state, daysOfWeek: state.daysOfWeek.filter(x => x !== action.day)};
            }
            break;
        case "setEndTime":
            try {
                newState = {...state, endTime: `${getUTCTime(action.val)}`};
            } catch (e) {
                newState = {...state};
            }
            break;
        case "reset":
            newState = {endTime: '', daysOfWeek: [], startTime: ''};
            break;
    }
    return newState;
}


export default function TimeChooseModal(props: Props) {
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [isOpen, setIsOpen] = useState<boolean>();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, dispatch] = useReducer(reducer, {startTime: '', endTime: '', daysOfWeek: []});
    const [inputValidations, setInputValidations] = useState<InputValidations>({startTimeInvalid: false, endTimeInvalid: false, daysOfWeekInvalid: false});

    useEffect(() => {
        setIsOpen(props.show)
    }, [props]);

    const toggle = () => {
        setIsOpen(!isOpen);
        if (props.onClose) {
            props.onClose();
        }
    };

    const onSubmit = () => {
        if (props.venue && formData.startTime !== '' && formData.endTime !== '' && formData.daysOfWeek.length > 0) {
            setSubmitting(true);
            api.updateHappyHour(+props.venue.id, formData.daysOfWeek, formData.startTime, formData.endTime).then((data) => {
                setNotifications([...notifications, {
                    type: NotificationType.SUCCESS,
                    title: 'Happy Hour Updated',
                    message: `Happy hour for venue ${props.venue!.name} successfully updated.`,
                    timeout: 3000
                }]);
                setInputValidations({startTimeInvalid: false, endTimeInvalid: false, daysOfWeekInvalid: false});
                dispatch({type: 'reset'});
                if (props.onSubmitSuccess) {
                    props.onSubmitSuccess();
                }
            }).catch((err) => {
                if (err.response) {
                    setNotifications([...notifications, {
                        type: NotificationType.ERROR,
                        title: 'Error Setting Happy Hour',
                        timeout: 3000,
                        message: `${err.response.data.message}`
                    }]);
                } else {
                    setNotifications([...notifications, {
                        type: NotificationType.ERROR,
                        title: 'Error Setting Happy Hour',
                        timeout: 3000,
                        message: `There was an error setting the happy hour for ${props.venue!.name}. Please try again later.`
                    }]);
                }
            }).finally(() => {
                setSubmitting(false);
                toggle();
            });
        } else {
            let startTimeInvalid = formData.startTime === '';
            let endTimeInvalid = formData.endTime === '';
            let daysOfWeekInvalid = formData.daysOfWeek.length === 0;
            setInputValidations({startTimeInvalid: startTimeInvalid, endTimeInvalid: endTimeInvalid, daysOfWeekInvalid: daysOfWeekInvalid});
        }
    };

    return (
        <Modal style={{position: 'relative'}} isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Select Happy Hour Time</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup row>
                        <Label sm={4} for={'start-time'}>Start Time</Label>
                        <Col sm={8}>
                            <Input invalid={inputValidations.startTimeInvalid} type={"time"} id={'start-time'} min={'09:00'} max={'22:00'} step={900} onChange={(e) => dispatch({type: "setStartTime", val: e.target.value})}/>
                            {inputValidations.startTimeInvalid && <FormFeedback>Field cannot be blank.</FormFeedback>}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={4} for={'end-time'}>End Time</Label>
                        <Col sm={8}>
                            <Input invalid={inputValidations.endTimeInvalid} type={"time"} id={'end-time'} min={'09:00'} max={'22:00'} step={900} onChange={(e) => dispatch({type: "setEndTime", val: e.target.value})}/>
                            {inputValidations.endTimeInvalid && <FormFeedback>Field cannot be blank.</FormFeedback>}
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <div style={{borderBottom: '1px solid lightgray'}}>
                            <Label>Days of Week</Label>
                            {inputValidations.daysOfWeekInvalid && <p style={{color: '#dc3545'}}>At least one day of week must be selected</p>}
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Sunday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('SUNDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'SUNDAY', add: val})} size={30}/>
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Monday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('MONDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'MONDAY', add: val})} size={30}/>
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Tuesday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('TUESDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'TUESDAY', add: val})} size={30}/>
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Wednesday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('WEDNESDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'WEDNESDAY', add: val})} size={30}/>
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Thursday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('THURSDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'THURSDAY', add: val})} size={30}/>
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Friday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('FRIDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'FRIDAY', add: val})} size={30}/>
                        </div>
                        <div className={'checkbox-area'}>
                            <p>Saturday</p>
                            <CustomCheckbox selected={formData.daysOfWeek.includes('SATURDAY')} onChange={(val) => dispatch({type: "addOrRemoveDay", day: 'SATURDAY', add: val})} size={30}/>
                        </div>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Beer4YourBuckBtn customStyle={BtnType.PRIMARY} onClick={onSubmit}>{submitting ?
                    <LoadingSpinner spinnerSize={20} style={{display: "flex", flexDirection: "row", alignItems: "center", maxWidth: '100%', maxHeight: '100%'}} message={'Submitting...'}/> : 'Submit'}
                </Beer4YourBuckBtn>
                <Beer4YourBuckBtn onClick={toggle} customStyle={BtnType.SECONDARY_CLEAR}>Cancel</Beer4YourBuckBtn>
            </ModalFooter>
        </Modal>
    )
}