import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AlertsComponent from "../../components/informative/AlertsComponent";

export default function LoginPage() {

    const [accountDetails, setAccountDetails] = useState({"email": "", "password": ""});
    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/account/authenticate", accountDetails, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                navigate('/admin');
            } else {
                setError(true);
                setErrorMessage("Account not found");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(true);
            setErrorMessage(error.response.data);
        }
    };

    const handleInputChange = (e) => {
        setAccountDetails({
            ...accountDetails,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Container className="w-25 justify-content-between align-items-center mt-5">
                <AlertsComponent
                    enabled={error}
                    key="danger"
                    variant="danger"
                    message={`An error has occurred, please try again. ${errorMessage}`}
                ></AlertsComponent>
                <Row>
                    <Col>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control

                                    type="email"
                                    placeholder="Enter email"
                                    className="w-100"
                                    id="email"
                                    name="email"
                                    value={accountDetails.email}
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    className="w-100"
                                    id="password"
                                    name="password"
                                    value={accountDetails.password}
                                    onChange={handleInputChange}
                                    required={true}
                                    max={15}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}