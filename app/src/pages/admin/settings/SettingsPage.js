import Sidebar from "../components/sidebar/Sidebar";
import {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";


export default function SettingsPage() {

    const [data, setData] = useState([]);
    const [themes, setThemes] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedNavbarItems, setSelectedNavbarItems] = useState({});

    const [settingsUpdated, setSettingsUpdated] = useState(false);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("http://localhost:8080/settings");
                const settings = res.data;

                const requests = settings.navbar_items.map(id =>
                    axios.get(`http://localhost:8080/page/id/${id}`)
                        .then(res => ({ id, data: res.data }))
                        .catch(error => {
                            console.error("Error fetching page data:", error);
                            return { id, data: { title: "Error loading" } };
                        })
                );

                const navbarData = await Promise.all(requests);
                setData(settings)
                setData(prevData => ({
                    ...prevData,
                    navbar_items: navbarData
                }));

            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/pages").then(res => {
            setPages(res.data);
        })
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
        try {

            data.navbar_items = selectedNavbarItems;
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
    const handleNavbarChange = (event) => {
        const selectedIds = Array.from(event.target.selectedOptions, option => option.value);

        setSelectedNavbarItems(selectedIds);

        console.log(selectedIds)
    };



    return (
        <>
            <Sidebar title={"Settings"}/>
            <Container>
                <Row>
                    {settingsUpdated && (
                        <Alert key="success" variant="success">
                           Data settings have now been updated.
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

                        <Form.Group className="mb-3" >
                            <Form.Text>Navbar</Form.Text>
                            <Form.Select multiple={true} required={true} onChange={handleNavbarChange}>
                                {pages.map(x => (
                                            <option key={x.id} value={x.id}>{x.title}</option>
                                        )
                                )}
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