import {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import {Alert, Card, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";

export default function ThemesPage (){

    const [themes, setThemes] = useState([]);
    const [currentTheme, setCurrentTheme] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:8080/themes")
            .then(res => {
                setThemes(res.data);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
            });

        axios.get("http://localhost:8080/theme")
            .then(res => {
                setCurrentTheme(res.data);
                console.log("current" + currentTheme);
            })
            .catch(error => {
                console.error("Error fetching current theme:", error);
            });
    }, []);


    useEffect(() => {
        console.log("Theme updated:", themes);
    }, [themes]);

    useEffect(() => {
        console.log("Theme current:", currentTheme);
    }, [currentTheme]);



    return (
        <>
            <Sidebar title={"Themes"}/>

            <Container>
                <Row>
                        {themes.map((item, index) => (
                            <Card style={{ width: '18rem', margin: '0 auto' }}>
                                <Card.Img src={item.featured_image}/>
                                <Card.Body>
                                    {currentTheme._id === item.id && (
                                        <Card.Header as="h5">Enabled</Card.Header>
                                    )}                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>

                                    <Link to={`/admin/theme/view/` + index}>
                                        <button className="btn btn-primary">View</button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        ))}

                </Row>
            </Container>

        </>
    )
}