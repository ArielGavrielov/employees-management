import React from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormFeedback } from 'reactstrap';
import './modal.css';

const AddOrEditModal = (props) => {
    // Loading after submitting
    const [isLoading, setIsLoading] = React.useState(false);

    // fields of the form
    const [formState, setFormState] = React.useState({
        firstname: '',
        lastname: '',
        email: ''
    });

    // error messages fields level
    const [fieldsErrors, setFieldsErrors] = React.useState({
        firstname: null,
        lastname: null,
        email: null
    });

    // messages from the server
    const [state, setState] = React.useState({
        error: null, 
        success: null, 
        emailUsed: null
    });

    // if props.modalProps.employee is not null, it means we are editing an employee
    React.useEffect(() => {
        if(props.modalProps.employee) {
            // set the form fields to the employee values
            setFormState({
                firstname: props.modalProps.employee.firstName,
                lastname: props.modalProps.employee.lastName,
                email: props.modalProps.employee.email
            });
        } else {
            // set the form fields to empty
            setFormState({
                firstname: '',
                lastname: '',
                email: ''
            });
        }
    }, [props.modalProps.employee]);

    // reset all messages and fields errors when the modal is open up
    React.useEffect(() => {
        if(props.modalProps.isOpen) {
            console.log('modal is open');
            setState({
                error: null,
                success: null,
                emailUsed: null
            });
            setFieldsErrors({
                firstname: null,
                lastname: null,
                email: null
            });
        }
    }, [props.modalProps.isOpen]);

    // check the validity of the form fields
    const validateForm = () => {
        const nameRegEx = /^[a-z ,.'-]{2,20}$/i;
        const emailRegEx = /^[^@]+@[^@]+\.[^@]+$/;
        return emailRegEx.test(formState.email) && nameRegEx.test(formState.firstname) && nameRegEx.test(formState.lastname) && !state.emailUsed;
    }

    // for editing an employee, check if performed changes
    const isChanged = () => {
        return formState.firstname !== props.modalProps.employee.firstName || formState.lastname !== props.modalProps.employee.lastName || formState.email !== props.modalProps.employee.email;
    }

    // onChange event handler
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    // onSubmit event handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!validateForm()) return;

        setState({
            error: null,
            success: null,
            emailUsed: null
        });

        // set loading to true for disabling the button
        setIsLoading(true);

        // check if we are editing an employee and if the changes are performed
        if(props.modalProps.employee && isChanged()) {
            axios.put(`http://localhost:8080/api/employees/${props.modalProps.employee.id}/`, formState)
            .then(response => {
                setState({success: response.data});
                setTimeout(() => window.location.reload(), 1000);
            }).catch(err => {
                console.log(err.response.data);
                setState({error: err.response.data, success: null, emailUsed: err.response.status === 409});
            }).finally(() => setIsLoading(false));
        } else {
            axios.post('http://localhost:8080/api/employees/', formState)
            .then(response => {
                setState({success: response.data});
                setTimeout(() => window.location.reload(), 1000);
            }).catch(err => {
                console.log(err.response.data);
                setState({error: err.response.data, success: null, emailUsed: err.response.status === 409});
            }).finally(() => setIsLoading(false));
        }
    }

    // toggle the modal
    const toggleModal = () => {
        props.setModalProps({isOpen: !props.modalProps.isOpen});
    }
    return (
        <div>
            <div id='modal' className='modal'>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    toggle={toggleModal}
                    isOpen={props.modalProps.isOpen}
                >
                    <ModalHeader toggle={toggleModal}>
                        {props.modalProps.employee ? "Edit" : "Add new"} employee
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} onChange={handleChange}>
                            <div className='form-group'>
                                <label>First name</label>
                                <Input 
                                    onChange={(event) => {
                                        if(/^[a-z ,.'-]{2,20}$/i.test(event.target.value)) {
                                            setFieldsErrors({...fieldsErrors, firstname: null});
                                        } else {
                                            setFieldsErrors({...fieldsErrors, firstname: 'Invalid first name'});
                                        }
                                    }} 
                                    type="text"
                                    valid={!fieldsErrors.firstname && formState.firstname !== ''}
                                    invalid={fieldsErrors.firstname && formState.firstname !== ''}
                                    required
                                    value={formState.firstname}
                                    name="firstname" 
                                />
                                {fieldsErrors.firstname && <FormFeedback valid={false}>{fieldsErrors.firstname}</FormFeedback>}
                                <label>Last name</label>
                                <Input 
                                    onChange={(event) => {
                                        if(/^[a-z ,.'-]{2,20}$/i.test(event.target.value))
                                            setFieldsErrors({...fieldsErrors, lastname: null});
                                        else
                                            setFieldsErrors({...fieldsErrors, lastname: 'Invalid last name'});
                                    }}
                                    type="text"
                                    valid={!fieldsErrors.lastname && formState.lastname !== ''}
                                    invalid={fieldsErrors.lastname && formState.lastname !== ''}
                                    required
                                    value={formState.lastname}
                                    name="lastname" 
                                />
                                {fieldsErrors.lastname && <FormFeedback valid={false}>{fieldsErrors.lastname}</FormFeedback>}
                                <label>Email</label>
                                <Input 
                                    onChange={(event) => {
                                        if(/^[^@]+@[^@]+\.[^@]+$/.test(event.target.value))
                                            setFieldsErrors({...fieldsErrors, email: null});
                                        else
                                            setFieldsErrors({...fieldsErrors, email: 'Invalid email'});
                                        
                                        if(state.emailUsed) {
                                            setState({...state, emailUsed: false, error: null});
                                        }
                                    }}
                                    valid={!state.emailUsed && !fieldsErrors.email && formState.email !== ''}
                                    invalid={state.emailUsed || (fieldsErrors.email && formState.email !== '')}
                                    required
                                    type="email" 
                                    value={formState.email}
                                    name="email" 
                                />
                                {fieldsErrors.email && <FormFeedback valid={false}>{fieldsErrors.email}</FormFeedback>}
                            </div>
                            <ModalFooter>
                                {state.error && <p className='text-danger'>{state.error}</p>}
                                {state.success && <p className='text-success'>{state.success}</p>}
                                <Button color='secondary' onClick={() => props.setModalProps({isOpen: false})}>Cancel</Button>
                                <Button color='primary' disabled={!validateForm() || isLoading || (props.modalProps.employee && !isChanged())} type='submit'>Submit</Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}

export default AddOrEditModal;