import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import axios from "axios";
import {useState} from "react";

export default function LoginPage() {

    const [accountDetails, setAccountDetails] = useState({"email": "", "password": ""});

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(accountDetails)
        try {
            const response = await axios.post("http://localhost:8080/account/authenticate", accountDetails, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Server Response:", response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        setAccountDetails({
            ...accountDetails,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" className="w-25" id="email" name="email" value={accountDetails.email} onChange={handleInputChange}/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" id="password" name="password" value={accountDetails.password} onChange={handleInputChange} required={true} max={15} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form></Col>
                </Row>
            </Container>
        </>
    )
}