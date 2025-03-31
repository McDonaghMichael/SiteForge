import Sidebar from "../components/sidebar/Sidebar";
import {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Card, NavItem, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavbarManager from "./categories/navbar/NavbarManager";

export default function SettingsPage() {

    const [data, setData] = useState([]);
    const [themes, setThemes] = useState([]);
    const [selectedNavbarItems, setSelectedNavbarItems] = useState({});

    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const API_KEY = '64ee95f21ab0e56130a5ed1e49838d32';

    const [settingsUpdated, setSettingsUpdated] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

        useEffect(() => {
            const fetchSettings = async () => {
                try {
                    const res = await axios.get("http://localhost:8080/settings");

                    setData(res.data);
                    console.log("Updated settings data:", res.data);
                } catch (error) {
                    console.error("Error fetching settings:", error);
                }
            };


        fetchSettings();
    }, []);

    useEffect(() => {
        const res = axios.get("http://localhost:8080/themes").then(res => {
            setThemes(res.data);
        })
    }, []);



    const handleChanges = async (e) => {
        e.preventDefault();
        setError(false);
        setSettingsUpdated(false);
        if (!file) {
            setErrorMessage('Please select a file first');
            setError(true);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {

            const response = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setFileUrl(data.data.url);
                console.log(fileUrl);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }

        try {


            data.updated_date = new Date().toLocaleDateString();
            data.navbar_items = selectedNavbarItems;
            data.fav_icon = fileUrl;
            const response = await axios.post("http://localhost:8080/settings/edit", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Updated data", response.data);

            setSettingsUpdated(true);
        } catch (error) {
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

    const handleNavbarChange = (items) => {
        setSelectedNavbarItems(items);
    }


    return (
        <>
            <Sidebar title={"Settings"}/>
            <Container>
                <Row>
                    {settingsUpdated && (
                        <Alert key="success" variant="success">
                           Settings have now been updated.
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
                            <Form.Control type="text" id="site_title" name="site_title" value={data.site_title || ""} onChange={handleInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="templates">
                            <Form.Text>Theme</Form.Text>
                            <Form.Select aria-label="Theme" required={true} value={data.default_theme} id="default_theme" name="default_theme" onChange={handleInputChange}>
                                {themes.map((theme, index) => (
                                    <option key={index} value={theme.id}>{theme.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={data.fav_icon} />
                            </Card>
                            <Form.Label>Favicon</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </Form.Group>
                        <Form.Text>Navbar Pages</Form.Text>

                        <Form.Group className="mb-3" controlId="navbar">
                            {data.navbar_items && (

                                <NavbarManager onChange={handleNavbarChange} items={data.navbar_items}></NavbarManager>
                            )}
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