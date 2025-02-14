import Sidebar from "../../components/sidebar/Sidebar";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Alert, ProgressBar, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export default function GeneralSettingsPage() {

    const [general, setGeneral] = useState([{"site_title":"","default_theme":""}]);
    const [themes, setThemes] = useState([]);

    const [settingsUpdated, setSettingsUpdated] = useState(false);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const res = axios.get("http://localhost:8080/settings").then(res => {
            setGeneral(res.data);
            console.log(res.data);
        })
    }, []);

    useEffect(() => {
        const res = axios.get("http://localhost:8080/themes").then(res => {
            setThemes(res.data);
            console.log(res.data[0]);
        })
    }, []);

    const handleChanges = async (e) => {
        e.preventDefault();
        setError(false);
        setSettingsUpdated(false);
        try {

            console.log(general)
            const response = await axios.post("http://localhost:8080/settings/edit", general, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setSettingsUpdated(true);
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.message);
        }
    };

    const handleInputChange = (e) => {
        setGeneral({
            ...general,
            [e.target.name]: e.target.value,
        });
    };


    return (
        <>
            <Sidebar title={"General Settings"}/>
            <Container>
                <Row>
                    {settingsUpdated && (
                        <Alert key="success" variant="success">
                           General settings have now been updated.
                        </Alert>

                    )}
                    {error && (
                        <Alert key="danger" variant="danger">
                            An error has occurred, please try again. {errorMessage}
                        </Alert>
                    )}
                    <Form onSubmit={handleChanges}>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Text>Title</Form.Text>
                            <Form.Control type="text" id="site_title" name="site_title" value={general.site_title || ""} onChange={handleInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="templates">
                            <Form.Text>Theme</Form.Text>
                            <Form.Select aria-label="Theme" required={true} value={general.default_theme} id="default_theme" name="default_theme" onChange={handleInputChange}>
                                {themes.map((theme, index) => (
                                    <option key={index} value={theme.id}>{theme.name}</option>
                                    ))}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Row>
            </Container>
        </>
    )
}