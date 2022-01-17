import React from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Card, CardBody } from 'reactstrap';
import './modal.css';

// Search employee by email
const SearchEmployee = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [employee, setEmployee] = React.useState(null);
    const [formState, setFormState] = React.useState({
        email: ''
    });
    const [state, setState] = React.useState({
        error: null,
        success: null
    });

    const toggleModal = () => setIsOpen(!isOpen);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.get(`http://localhost:8080/api/employees/${formState.email}`)
        .then(res => {
            setIsLoading(false);
            setEmployee(res.data);
            setState({
                error: null,
                success: 'Employee found'
            });
        })
        .catch(err => {
            setIsLoading(false);
            setEmployee(null);
            setState({
                error: err.response.data,
                success: null
            });
        });
    }

    return (
        <div>
            <Button color="primary" onClick={toggleModal}>Search employee</Button>
            <Modal toggle={toggleModal} isOpen={isOpen} size='lg' centered>
                <ModalHeader toggle={toggleModal}>Search Employee</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Email</label>
                        <Input 
                            onChange={(event) => setFormState({email: event.target.value})}
                            valid={formState.email !== '' && /^[^@]+@[^@]+\.[^@]+$/.test(formState.email)}
                            invalid={formState.email !== '' && !/^[^@]+@[^@]+\.[^@]+$/.test(formState.email)}
                            required
                            type="email"
                            value={formState.email}
                            name="email" 
                        />
                    </div>
                    {employee && <Card>
                        <CardBody>
                            <h5>{employee.firstName} {employee.lastName}</h5>
                            <p>Employee Email: {employee.email}</p>
                            <p>Employee ID: {employee.id}</p>
                        </CardBody>
                    </Card>}
                </ModalBody>
                <ModalFooter>
                    {state.success && <p className='text-success'>{state.success}</p>}
                    {state.error && <p className='text-danger'>{state.error}</p>}
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    <Button color="primary" onClick={handleSubmit} disabled={isLoading || !/^[^@]+@[^@]+\.[^@]+$/.test(formState.email)} >Search</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default SearchEmployee;