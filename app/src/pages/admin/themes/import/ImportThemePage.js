import {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Alert, Card, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ThemePreview from "../../components/themes/ThemePreview";
import {Link} from "react-router-dom";

export default function ImportThemePage (){

    const [jsonData, setJsonData] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError(false);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                setJsonData(parsedData);
                setSuccess(true);
                setSuccessMessage("JSON File has been uploaded.");
            } catch (error) {
                console.error("Invalid JSON file:", error);
                setError(true);
                setErrorMessage(error.message);
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        setError(false);

        if (!jsonData) {
            setError(true);
            setErrorMessage("No JSON Data to upload.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/theme/import", jsonData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setSuccess(true);
            setSuccessMessage("Theme has now been imported.");
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.message);
        }
    };

    return (
        <>
            <Sidebar title={"Import Theme"}/>
            <Container>
                <Row>
                    {success && (
                        <Alert key="success" variant="success">
                            {successMessage} Enable the theme <Link to="/admin/settings/general">HERE</Link>.
                        </Alert>

                    )}
                    {error && (
                        <Alert key="danger" variant="danger">
                            An error has occurred, please try again. {errorMessage}
                        </Alert>

                    )}
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Please upload a JSON File with the supported format</Form.Label>
                            <Form.Control type="file" accept=".json" onChange={handleFileUpload}/>
                            <br/>
                            <Button onClick={handleUpload} disabled={!jsonData} className="btn btn-primary">Upload to Website</Button>
                        </Form.Group>
                    </Form>
                    {jsonData instanceof Object && (
                        <Container>
                            <Row>
                                <Card>
                                    <Card.Header>Header</Card.Header>
                                    <Card.Body>
                                        <ThemePreview css={jsonData.css} html={jsonData.navbar} />
                                    </Card.Body>
                                </Card>
                            </Row>
                            <br/>
                            <Row>
                                <Card>
                                    <Card.Header>Footer</Card.Header>
                                    <Card.Body>
                                        <ThemePreview css={jsonData.css} html={jsonData.footer} />
                                    </Card.Body>
                                </Card>
                            </Row>
                            <br/>
                            <Row>
                                <Card>
                                    <Card.Header>CSS</Card.Header>
                                    <Card.Body>
                                        <code>{jsonData.css}</code>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </Container>
                    )}

                </Row>
            </Container>

        </>
    )
}