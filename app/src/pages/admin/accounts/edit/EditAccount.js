import Container from "react-bootstrap/Container";
import {Alert, Col, Row} from "react-bootstrap";
import Sidebar from "../../components/sidebar/Sidebar";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import ModalsComponent from "../../components/informative/ModalsComponent";
import AlertsComponent from "../../components/informative/AlertsComponent";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function EditAccount() {

    const { id } = useParams();

    const [account, setAccount] = useState({});

    const [accountUpdated, setAccountUpdated] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const res = axios.get(`http://localhost:8080/account/id/${id}`).then((res) => {
            setAccount(res.data);
            console.log(res.data);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setAccountUpdated(false);

        try {

            account.updated_date = new Date().toLocaleDateString();
            const response = await axios.post("http://localhost:8080/account/edit", account, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            setAccountUpdated(true);
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.message);
        }
    }

    const handleInputChange = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Sidebar title={"Edit Account"}/>
            <Container>
                <Row>
                    <Col>
                        <ModalsComponent
                            enabled={accountUpdated}
                            title={"Account Updated"}
                            body={"Account has been successfully updated."}
                        />
                        <AlertsComponent
                            enabled={error}
                            key="danger"
                            variant="danger"
                            message={`An error has occurred, please try again. ${errorMessage}`}
                        ></AlertsComponent>
                        <Container>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="first_name">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter First Name" id="first_name" name="first_name" value={account.first_name} onChange={handleInputChange} required={true} max={60}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="last_name">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Last Name" id="last_name" name="last_name" value={account.last_name} onChange={handleInputChange} required={true} max={60}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Username" id="username" name="username" value={account.username} onChange={handleInputChange} required={true} max={15}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" id="email" name="email" value={account.email} onChange={handleInputChange} required={true} max={60}/>
                                            <Form.Text className="text-muted">
                                                Last Updated: {account.updated_date}
                                            </Form.Text>
                                            <br/>
                                            <Form.Text className="text-muted">
                                                Created Date: {account.created_date}
                                            </Form.Text>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Col>




                                </Row>
                            </Form>



                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}