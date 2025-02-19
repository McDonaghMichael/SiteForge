import {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {Link, useParams} from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import ThemePreview from "../../components/themes/ThemePreview";

export default function ViewThemePage () {

    const [theme, setTheme] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        axios.get("http://localhost:8080/themes")
            .then(res => {
                setTheme(res.data[id]);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Theme updated:", theme);
    }, [theme]);


    return (
        <>
            <Sidebar title={"View Theme"}/>
            <Container>
                <Row>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            {theme.author && (
                                <th>Author</th>
                            )}
                            <th>Description</th>
                            {theme.website && (
                                <th>Website</th>
                            )}
                            {theme.github && (
                                <th>Github</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{theme.name}</td>
                            {theme.author && (
                                <td>{theme.author}</td>
                            )}
                            <td>{theme.description}</td>
                            {theme.website && (
                                <td><a href={theme.website} target="_blank">{theme.website.replace("https://", "")}</a> </td>
                            )}
                            {theme.github && (
                                <td><a href={theme.github} target="_blank">{theme.github.replace("https://github.com/", "")}</a> </td>
                            )}
                        </tr>
                        </tbody>
                    </table>
                    <div className="container">
                        <Row>
                            <h4>Navbar</h4>
                            <ThemePreview css={theme.css} html={theme.navbar} />
                        </Row>
                        <Row>
                            <h4>Footer</h4>
                            <ThemePreview css={theme.css} html={theme.footer} />
                        </Row>
                        <Row>
                            <h4>CSS</h4>
                            <code>{theme.css}</code>
                        </Row>
                    </div>

                </Row>
            </Container>
        </>
    )
}