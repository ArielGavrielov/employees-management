import React from 'react';
import AddOrEditModal from './AddOrEditModal';
import axios from 'axios';
import { Button, Col, Table } from 'reactstrap';
import SearchEmployee from './SearchEmployee';

const Employees = () => {
    const [employees, setEmployees] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalProps, setModalProps] = React.useState({
        isOpen: false,
        employee: null
    });

    React.useEffect(() => {
        if(isLoading) {
            // Get employees
            axios.get('http://localhost:8080/api/employees/').then(response => {
                setEmployees(response.data);
                setIsLoading(false);
            }).catch(err => {
                window.alert('Error: ' + err.response.data);
            });
        }
    }, [isLoading]);
    
    if(isLoading)
        return <h3>Loading...</h3>;
    
    return (
        <div>
            <AddOrEditModal modalProps={modalProps} setModalProps={setModalProps}/>
            <div style={{display: 'flex'}}>
                <Col style={{display: 'flex', justifyContent: 'center', height: '100%'}}>
                    <SearchEmployee />
                </Col>
                <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%'}}>
                    <Button color="primary" onClick={() => setModalProps({isOpen: true, employee: null})}>Add new employee</Button>
                </Col>
            </div>
            <br /><br />
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td><a href={employee.email}>{employee.email}</a></td>
                            <td>
                                <Button color="warning" onClick={() => {
                                        setModalProps({isOpen: true, employee: employee});
                                }}>Edit</Button>{' '}
                                <Button color="danger" onClick={() => {
                                    if(window.confirm('Are you sure you want to delete this employee?')) {
                                        axios.delete(`http://localhost:8080/api/employees/${employee.id}/`).then(response => {
                                            setEmployees(employees.filter(e => e.id !== employee.id));
                                            window.alert('Employee deleted successfully!');
                                        }).catch(err => {
                                            window.alert('Error deleting employee!');
                                        });
                                    }
                                }}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Employees;
