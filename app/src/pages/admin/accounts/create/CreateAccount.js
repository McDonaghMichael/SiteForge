import Container from "react-bootstrap/Container";
import {Alert, Col, Row} from "react-bootstrap";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useState} from "react";
import axios from "axios";

export default function CreateAccount() {

    const [data, setData] = useState([{
        "first_name": "",
        "last_name": "",
        "username": "",
        "email": "",
        "password": "",
        "confirmPassword": ""
    }]);

    const [accountCreated, setAccountCreated] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChanges = async (e) => {
        e.preventDefault();
        setError(false);
        setAccountCreated(false);

        try {
            const response = await axios.post("http://localhost:8080/account/create", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            setAccountCreated(true);
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.message);
        }
    };

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Sidebar title={"Create Account"}/>
            <Container>
                <Row>
                    {accountCreated && (
                        <Alert key="success" variant="success">
                            Account has been created successfully.
                        </Alert>

                    )}
                    {error && (
                        <Alert key="danger" variant="danger">
                            An error has occurred, please try again. {errorMessage}
                        </Alert>

                    )}
                    <Container>
                            <Form onSubmit={handleChanges}>
                                <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="first_name">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter First Name" id="first_name" name="first_name" value={data.first_name} onChange={handleInputChange} required={true} max={60}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="last_name">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Last Name" id="last_name" name="last_name" value={data.last_name} onChange={handleInputChange} required={true} max={60}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Username" id="username" name="username" value={data.username} onChange={handleInputChange} required={true} max={15}/>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" id="email" name="email" value={data.email} onChange={handleInputChange} required={true} max={60}/>
                                        <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" id="password" name="password" value={data.password} onChange={handleInputChange} required={true} max={15}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="confirmPassword" value={data.confirmPassword} onChange={handleInputChange} required={true} max={15}/>
                                    </Form.Group>
                                    {data.password !== data.confirmPassword && (
                                        <Alert key="danger" variant="danger">
                                            Passwords do not match!
                                        </Alert>
                                    )}
                                </Col>


                                </Row>
                            </Form>



                    </Container>
                </Row>
            </Container>
        </>
    )
}